document.getElementById("getcalculation").addEventListener("click", () => {
     const depth = document.getElementById("depth").value,
          height = document.getElementById("height").value,
          widht = document.getElementById("width").value,
          rate = document.getElementById("rate").value;
          const bps = widht * height * depth * rate,
          result_IN_SEONDS = bps / 1000000 / 1 * 1,
          result_IN_SEONDSHalf = (bps / 1000000 / 1 * 1)/2;
     document.getElementById("interlaced").innerHTML = `${result_IN_SEONDSHalf}Mbps = ${result_IN_SEONDSHalf/8}MB/s`
     document.getElementById("progressive").innerHTML = `${result_IN_SEONDS}Mbps = ${result_IN_SEONDS/8}MB/s`
     document.getElementById("aspect").innerHTML = `${(widht/height).toFixed(2)}`
     document.getElementById("megapixel").innerHTML = `${((height*widht)/1000000).toFixed(2)} MP(${(height*widht)})`
});