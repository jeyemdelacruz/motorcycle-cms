function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
  }

  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const arrow = document.getElementById('arrowToggle');
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      sidebar.classList.toggle('show');
    } else {
      sidebar.classList.toggle('hidden');
      content.classList.toggle('expanded');
    }
    arrow.textContent = sidebar.classList.contains('hidden') || sidebar.classList.contains('show') ? '▶' : '◀';
  }


  window.addEventListener('DOMContentLoaded', () => {
    const canvasId = 'analyticsChartCanvas';
    let canvas = document.getElementById(canvasId);

    if (!canvas) {
      const wrapper = document.createElement('div');
      wrapper.style.width = '100%';
      wrapper.style.height = '400px';
      wrapper.style.background = '#fff';
      wrapper.style.padding = '20px';
      wrapper.style.borderRadius = '12px';
      wrapper.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
      wrapper.style.margin = '30px 0';
      wrapper.innerHTML = `<canvas id="${canvasId}" style="width: 100%; height: 100%;"></canvas>`;
      document.querySelector('#home').insertBefore(wrapper, document.querySelector('#home').children[2]);
      canvas = document.getElementById(canvasId);
    }

    if (canvas) {
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          datasets: [{
            label: 'User Visits',
            data: [12, 19, 3, 5, 2],
            borderColor: '#6f42c1',
            backgroundColor: 'rgba(111, 66, 193, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                padding: 20
              }
            }
          }
        }
      });
    }

    fetch('/Partial/user-list-dashboard.html')
    .then(res => res.text())
    .then(html => {
      const userListSection = document.createElement('div');
      userListSection.style.margin = '20px 0';
      userListSection.innerHTML = html;
      const homeSection = document.querySelector('#home');
      homeSection.insertBefore(userListSection, homeSection.children[3]);
    });

    });

  
  


