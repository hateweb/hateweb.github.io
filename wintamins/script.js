function getRelativeElapsedTime(previousDate, locale = 'en') {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const elapsedMs = previousDate - new Date();
  const units = [
    { name: 'year', ms: 31536000000 },
    { name: 'month', ms: 2628000000 },
    { name: 'day', ms: 86400000 },
    { name: 'hour', ms: 3600000 },
    { name: 'minute', ms: 60000 },
    { name: 'second', ms: 1000 }
  ];

  for (const unit of units) {
    if (Math.abs(elapsedMs) >= unit.ms || unit.name === 'second') {
      const value = Math.round(elapsedMs / unit.ms);
      return rtf.format(value, unit.name);
    }
  }
}

function getArch() {
	const ua = navigator.userAgent;
	const x64Regex = /x86_64|x86-64|Win64|WOW64|x64|ia64|amd64/i;
	return x64Regex.test(ua) ? '64' : '32'; // Defaults to 32-bit if no 64-bit markers are found
}

function properNames(arch) {
	return arch == '32' ? 'x86' : 'x64';
}

document.addEventListener('DOMContentLoaded', () => {
	const arch = getArch();
	const dl = document.getElementById('btn-main');
	dl.href = 'https://github.com/hateweb/Wintamins/releases/latest/download/Wintamins' + arch + '.exe';
	const dltext = document.getElementById('dltext');
	dltext.textContent += ' (' + properNames(arch) + ')';

	fetch('../version.txt')
		.then(response => {
			if (!response.ok) {
				throw new Error('failed to get current version');
			}
			return response.text();
		})
		.then(textData => {
			document.getElementById('ver').textContent = 'v' + textData.trim();
		})
		.catch(error => {
			console.error('Error loading the text file:', error);
			document.getElementById('ver').textContent = '';
		});

	fetch('../commit.txt')
		.then(response => {
			if (!response.ok) {
				throw new Error('failed to get last commit timestamp');
			}
			return response.text();
		})
		.then(textData => {
			const time_elapsed = getRelativeElapsedTime(Number(textData.trim() + '000'));
			document.getElementById('ver').textContent = time_elapsed;
		})
		.catch(error => {
			document.getElementById('ver').textContent = '';
		});

	const toggleBtn = document.querySelector('.btn-toggle');
	const dropdownMenu = document.querySelector('.dropdown-menu');

	if (toggleBtn && dropdownMenu) {
		toggleBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			const isExpanded = dropdownMenu.classList.toggle('show');
			toggleBtn.setAttribute('aria-expanded', isExpanded);
		});

		document.addEventListener('click', (e) => {
			if (!toggleBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
				dropdownMenu.classList.remove('show');
				toggleBtn.setAttribute('aria-expanded', 'false');
			}
		});
	}
});
