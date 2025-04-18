// Gráfico de ocupación mensual
var ocupacionCtx = document.getElementById('ocupacionChart').getContext('2d');
var ocupacionChart = new Chart(ocupacionCtx, {
  type: 'bar',
  data: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{
      label: 'Ocupación %',
      data: [65, 59, 80, 81, 75, 82, 90, 85, 78, 75, 80, 88],
      backgroundColor: 'rgba(60,141,188,0.9)',
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});

// Gráfico de tipos de reserva
var reservasCtx = document.getElementById('reservasChart').getContext('2d');
var reservasChart = new Chart(reservasCtx, {
  type: 'doughnut',
  data: {
    labels: ['Estandar', 'Presidencial', 'Familiar'],
    datasets: [{
      data: [35, 30, 20],
      backgroundColor: ['#f56954', '#00a65a', '#f39c12'],
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  }
});