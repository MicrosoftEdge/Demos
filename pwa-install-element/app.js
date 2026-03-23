if ('HTMLInstallElement' in window) {
    const installElements = document.querySelectorAll('install');

    installElements.forEach((button) => {
        button.addEventListener('promptaction', (event) => {
            const label = button.id || button.getAttribute('installurl') || 'same-origin';
            console.log(`Install succeeded: ${label}`);
        });

        button.addEventListener('promptdismiss', (event) => {
            const label = button.id || button.getAttribute('installurl') || 'same-origin';
            console.log(`Install failed: ${label}`);
        });

        button.addEventListener('validationstatuschanged', (event) => {
            if (event.target.invalidReason === 'install_data_invalid') {
                const label = button.id || button.getAttribute('installurl') || 'same-origin';
                console.log(`Install data invalid: ${label}`);
            }
        });
    });
} else {
    console.warn('HTMLInstallElement not supported');
}
