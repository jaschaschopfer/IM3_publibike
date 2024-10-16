const sliders = document.querySelectorAll('.slider');
sliders.forEach(slider => {
    slider.addEventListener('input', function() {
        const timeValue = this.value;
        fetch(`fetch_data.php?time=${timeValue}`)
            .then(response => response.json())
            .then(data => {
                updateGraph(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    });
});
