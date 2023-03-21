mymap.eachLayer((layer) => {
  if (layer.options.radius) {
    console.log(
      JSON.stringify({
        lngLat: [layer.getLatLng().lng, layer.getLatLng().lat],
        radius: layer.getRadius(),
      })
    );
  }
});
