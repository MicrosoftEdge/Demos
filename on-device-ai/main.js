import { env, AutoTokenizer } from "@xenova/transformers";
import { LLM } from "./llm.js";

const MODELS = {
  phi3: {
    name: "phi3",
    path: "microsoft/Phi-3-mini-4k-instruct-onnx-web",
    externaldata: true,
  },
  phi3dev: {
    name: "phi3dev",
    path: "schmuell/Phi-3-mini-4k-instruct-onnx-web",
    externaldata: true,
  },
};

function getConfig() {
  const query = window.location.search.substring(1);
  var config = {
    model: "phi3",
    provider: "webgpu",
    profiler: 0,
    verbose: 0,
    threads: 1,
    show_special: 0,
    csv: 0,
    max_tokens: 9999,
    local: 0,
  }
  let vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] in config) {
      const key = pair[0];
      const value = decodeURIComponent(pair[1]);
      if (typeof config[key] == "number") {
        config[key] = parseInt(value);
      }
      else {
        config[key] = value;
      }
    } else if (pair[0].length > 0) {
      throw new Error("unknown argument: " + pair[0]);
    }
  }
  if (MODELS[config.model] !== undefined) {
    config.model = MODELS[config.model];
  }
  return config;
}

const config = getConfig();

// setup for transformers.js tokenizer
env.localModelPath = 'models';
env.allowRemoteModels = config.local == 0;
env.allowLocalModels = config.local == 1;

let tokenizer;

const llm = new LLM();

function token_to_text(tokenizer, tokens, startidx) {
  const txt = tokenizer.decode(tokens.slice(startidx), { skip_special_tokens: config.show_special != 1, });
  return txt;
}

export async function Query(continuation, query, cb) {
  let prompt = (continuation) ? query : `<|system|>\nYou are a friendly assistant.<|end|>\n<|user|>\n${query}<|end|>\n<|assistant|>\n`;

  const { input_ids } = await tokenizer(prompt, { return_tensor: false, padding: true, truncation: true });

  // clear caches 
  // TODO: use kv_cache for continuation
  llm.initilize_feed();

  const start_timer = performance.now();
  const output_index = llm.output_tokens.length + input_ids.length;
  const output_tokens = await llm.generate(input_ids, (output_tokens) => {
    if (output_tokens.length == input_ids.length + 1) {
      // time to first token
      const took = (performance.now() - start_timer) / 1000;
      console.log(`time to first token in ${took.toFixed(1)}sec, ${input_ids.length} tokens`);
    }
    cb(token_to_text(tokenizer, output_tokens, output_index));
  }, { max_tokens: config.max_tokens });

  const took = (performance.now() - start_timer) / 1000;
  cb(token_to_text(tokenizer, output_tokens, output_index));
  const seqlen = output_tokens.length - output_index;
  console.log(`${seqlen} tokens in ${took.toFixed(1)}sec, ${(seqlen / took).toFixed(2)} tokens/sec`);
}

export function Abort() {
  llm.abort();
}

//
// Load the model and tokenizer
//
async function Start(hasFP16) {
  try {
    tokenizer = await AutoTokenizer.from_pretrained(config.model.path);

    console.log("Loading model...");
    await llm.load(config.model, {
      provider: config.provider,
      profiler: config.profiler,
      verbose: config.verbose,
      local: config.local,
      max_tokens: config.max_tokens,
      hasFP16: hasFP16,
    });
    console.log("Ready.");
  } catch (error) {
    console.log(error);
  }
}

//
// Check if we have webgpu and fp16
//
async function hasWebGPU() {
  // returns 0 for webgpu with f16, 1 for webgpu without f16, 2 for no webgpu
  if (!("gpu" in navigator)) {
    return 2;
  }
  try {
    const adapter = await navigator.gpu.requestAdapter()
    if (adapter.features.has('shader-f16')) {
      return 0;
    }
    return 1;
  } catch (e) {
    return 2;
  }
}

// Main entry point, which will load the model.
export function Init() {
  return new Promise(resolve => {
    hasWebGPU().then((supported) => {
      if (supported < 2) {
        if (supported == 1) {
          console.log("Your GPU or Browser does not support webgpu with fp16, using fp32 instead.");
        }
        Start(supported === 0).then(() => {
          resolve();
        });
      } else {
        console.log("Your GPU or Browser does not support webgpu");
      }
    });
  }); 
}
