try {
    document.querySelector('body:has(section)');
} catch (e) {
    //browser does not support the has operator
    alert('Your browser does not support :has() selector. Go to aboug:config and change "layout.css.has-selector.enabled" value');
}
