

export const loadScripts = () => {
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCU1RNFpYAbRetPqgZQIiz3lSkFJR2LOPU&callback=initMap";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
}
