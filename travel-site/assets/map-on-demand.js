const MAP_CONTAINER_EL = document.querySelector('.place-discover-map');

const mapElIntersectionObserver = new IntersectionObserver(loadMapOnDemand);
mapElIntersectionObserver.observe(MAP_CONTAINER_EL);

let map = null;

function loadMapOnDemand(entries) {
  if (map) {
    return;
  }

  if (!entries.some(entry => entry.isIntersecting)) {
    return;
  }

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=Ap_eazGgpq5468v9MXr7Wu0zh30LQActgaT-tI_QxZQSm-Bd5qJxVKs_2B7NsqR4';
  document.body.appendChild(script);
}

function GetMap() {
  map = new Microsoft.Maps.Map(MAP_CONTAINER_EL, {
    center: new Microsoft.Maps.Location(42.564423, 8.76352),
    zoom: 10.5
  });

  const places = [
    {
      location: [42.564423, 8.76352]
    }, {
      location: [42.581177, 8.841188]
    }, {
      location: [42.50025, 8.87546]
    }, {
      location: [42.491052, 8.672658]
    }
  ];

  for (const { location } of places) {
    const point = new Microsoft.Maps.Location(location[0], location[1]);

    const pin = new Microsoft.Maps.Pushpin(point, {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 150 150" width="40" height="40"><path fill="#FFF" d="M71 32.9c-4.6 1.5-8.5 3.9-11.6 7.3-5.3 5.5-6.8 9.5-6.8 17.3 0 8.1 1.5 11.8 7.6 18.1 3.6 3.8 4.3 5.5 9.1 22.4 7.6 26.8 9 26.8 16.3 0 4.4-16.5 5-17.8 9-22 6.3-6.8 7.8-10.4 7.8-18.5 0-10.1-4.8-18-13.8-22.7-4.3-2.2-13.6-3.2-17.6-1.9zm18.8 5.4c6.3 4.1 9.5 9.7 10 17.2.6 8.3-1.1 12.9-6.7 18.4-4.5 4.5-4.7 5.1-9.6 22.4-2.8 9.8-5.5 17.8-6 17.8s-3.2-8.1-6-18c-4.8-17-5.3-18.3-8.7-21.1-5-4.2-7.8-10.3-7.8-17.3 0-9.4 4.2-16.6 12.3-20.6 6.2-3.2 16.8-2.6 22.5 1.2z"/><path fill="#007C00" d="M72.2 35.9c-5.2 1.4-10.9 5.7-13.8 10.7-2.2 3.8-2.8 6-2.8 10.8.1 7.2 2 11.5 7.6 16.7 3.7 3.5 4.2 4.8 8.9 21.5 2.8 9.8 5.2 18 5.3 18.1.2.2 2.5-7.7 5.2-17.4 4.6-16.9 5.1-18 9-21.8 5.9-5.8 7.7-9.9 7.8-17.2 0-5.1-.5-7-3-11-5-8.1-15.4-12.5-24.2-10.4z"/></svg>',
      anchor: new Microsoft.Maps.Point(20, 40)
    });

    map.entities.push(pin);
  }
}