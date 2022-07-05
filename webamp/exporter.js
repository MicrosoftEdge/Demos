export async function exportSongToFile(song) {
  const url = song.type === 'file' ? URL.createObjectURL(song.data) : song.id;
  download(url, song.title + '.mp3');  
}

function download(url, fileName) {
  const link = document.createElement('a');
  link.setAttribute('download', fileName);
  link.setAttribute('href', url);
  link.click();
}
