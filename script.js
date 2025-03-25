// it is a good idea to wait for the DOM to load before running any javascript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const xInput = document.getElementById('x-input');
    const yInput = document.getElementById('y-input');
    const addPointBtn = document.getElementById('add-point');
    const clearPointsBtn = document.getElementById('clear-points');
    const dataTableBody = document.getElementById('data-table-body');
    const trendlineEquation = document.getElementById('trendline-equation');
    
    // Initialize data array
    let dataPoints = [];
    
    // Initialize chart
    const chart = initializeChart();
    
    // Add point button click handler
    addPointBtnHandler();
    
    // Clear points button click handler
    clearPointsBtn.addEventListener('click', function() {
        dataPoints = [];
        updateChart();
        dataTableBody.innerHTML = '';
        trendlineEquation.textContent = 'Add points to see the trendline equation';
    });

    // Function to initialize the chart
    function initializeChart() {
        const ctx = document.getElementById('dataChart').getContext('2d');
        return new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Data Points',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    pointRadius: 6
                }, {
                    label: 'Trendline',
                    data: [],
                    type: 'line',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    pointRadius: 0,
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'X Value'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Y Value'
                        }
                    }
                }
            }
        });
    }
    
    // Function to add a point to the data array
    function addPointBtnHandler() {
        addPointBtn.addEventListener('click', function() {
            const x = parseFloat(xInput.value);
            const y = parseFloat(yInput.value);
            
            if (isNaN(x) || isNaN(y)) {
                alert('Please enter valid numbers for X and Y');
                return;
            }
            
            // Add point to data array
            dataPoints.push({x, y});
            
            // Update chart
            updateChart();
            
            // Update table
            addRowToTable(x, y);
            
            // Clear inputs
            xInput.value = '';
            yInput.value = '';
            xInput.focus();
        });
    }

    // Function to add a row to the data table
    function addRowToTable(x, y) {
        const row = document.createElement('tr');
        
        const xCell = document.createElement('td');
        xCell.textContent = x;
        
        const yCell = document.createElement('td');
        yCell.textContent = y;
        
        row.appendChild(xCell);
        row.appendChild(yCell);
        
        dataTableBody.appendChild(row);
    }
    
    // Function to calculate linear regression (least squares method)
    function calculateLinearRegression(points) {
        if (points.length < 2) return null;
        
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;
        const n = points.length;
        
        for (const point of points) {
            sumX += point.x;
            sumY += point.y;
            sumXY += point.x * point.y;
            sumXX += point.x * point.x;
        }
        
        // Calculate slope (m) and y-intercept (b) for y = mx + b
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return {
            slope,
            intercept,
            equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`
        };
    }
    
    // Function to update the chart with new data
    function updateChart() {
        // Update scatter plot
        chart.data.datasets[0].data = dataPoints;
        
        // Calculate and update trendline
        const regression = calculateLinearRegression(dataPoints);
        
        if (regression) {
            // Display equation
            trendlineEquation.textContent = `Trendline Equation: ${regression.equation}`;
            
            // Generate trendline points
            if (dataPoints.length > 0) {
                const minX = Math.min(...dataPoints.map(p => p.x));
                const maxX = Math.max(...dataPoints.map(p => p.x));
                
                const trendlinePoints = [
                    {x: minX, y: regression.slope * minX + regression.intercept},
                    {x: maxX, y: regression.slope * maxX + regression.intercept}
                ];
                
                chart.data.datasets[1].data = trendlinePoints;
            } else {
                chart.data.datasets[1].data = [];
            }
        } else {
            trendlineEquation.textContent = 'Add at least 2 points to see the trendline equation';
            chart.data.datasets[1].data = [];
        }
        
        chart.update();
    }
}); 