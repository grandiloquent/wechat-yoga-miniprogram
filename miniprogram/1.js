(() => {

    console.log([...new Array(13).keys()]
        .map(x => `case Key.F${x+1}:
       {
           break;
       }`).join('\n'));
})();