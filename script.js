document.addEventListener('DOMContentLoaded', () => {
	
	const elements = document.querySelectorAll( 'a[href="#"]' ).forEach(link => {
		link.addEventListener( 'click', (e) => {
			const target = link.getAttribute('href')
			if (target.length > 1 && document.querySelector(target)) {
				e.preventDefault()
				document.querySelector(target).scrollIntoView({ behavior: 'smooth' })
				history.replaceState(null, '', target)
			}
		})
	})

	const form = document.querySelector('form[action="submit_adoption_form.php"]') || document.querySelector('form')
	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault()
			clearFormErrors(form)
			const data = new FormData(form)
			const values = Object.fromEntries(data.entries())
			

			if (errors.length) {
				errors.forEach(err => showFieldError(form, err.field, err.msg))
				const first = form.querySelector('[name="' + errors[0].field + '"]')
				if (first && first.focus) first.focus()
				return
			}
const errors = [];
			if (!values.name || values.name.trim().length < 2) errors.push({ field: 'name', msg: 'Please enter your first name.' })
			if (!values.surname || values.surname.trim().length < 2) errors.push({ field: 'surname', msg: 'Please enter your surname.' })
			if (!values.email || !test(values.email)) errors.push({ field: 'email', msg: 'Please enter a valid email address.' })
			if (!values.phone || !test(values.phone)) errors.push({ field: 'phone', msg: 'Please enter a valid phone number.' })
			if (!values.living_condition || values.living_condition.trim().length < 5) errors.push({ field: 'living_condition', msg: 'Please describe your living conditions.' })
			if (!values.pet || values.pet.trim() == '') errors.push({ field: 'pet', msg: 'Please select a pet.' })
			






			showSubmissionMessage('Thank you! Your adoption application has been received.')
			form.reset()
		})
	}

	function clearFormErrors(form) {
		form.querySelectorAll('.error-msg').forEach(el => el.remove())
	}

	function showFieldError(form, fieldName, message) {
		const field = form.querySelector('[name="' + fieldName + '"]')
		const span = document.createElement('span')
		span.className = 'error-msg'
		span.style.color = 'crimson'
		span.style.display = 'block'
		span.style.marginTop = '4px'
		span.textContent = message
		if (field) field.insertAdjacentElement('afterend', span)
	}

	function showSubmissionMessage(msg) {
		const d = document.createElement('div')
		d.className = 'submission-msg'
		d.style.position = 'fixed'
		d.style.left = '50%'
		d.style.top = '20px'
		d.style.transform = 'translateX(-50%)'
		d.style.background = '#fff'
		d.style.border = '1px solid #ccc'
		d.style.padding = '10px 16px'
		d.style.zIndex = 9999
		d.textContent = msg
		document.body.appendChild(d)
		setTimeout(() => d.remove(), 4000)
	}

	const lightbox = createLightbox()
	document.querySelectorAll('img').forEach(img => {
		img.style.cursor = 'zoom-in'
		img.addEventListener('click', () => {
			openLightbox(lightbox, img.src, img.alt || '')
		})
	})

	function createLightbox() {
		const overlay = document.createElement('div')
		overlay.id = 'lightbox-overlay'
		Object.assign(overlay.style, {
			position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
			background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
			zIndex: 10000, padding: '20px', boxSizing: 'border-box', visibility: 'hidden'
		});
		const img = document.createElement('img')
		img.style.maxWidth = '100%'
		img.style.maxHeight = '100%'
		img.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)'
		const caption = document.createElement('div')
		caption.style.color = '#fff'; caption.style.marginTop = '8px'; caption.style.textAlign = 'center'
		const wrapper = document.createElement('div')
		wrapper.style.maxWidth = '900px'
		wrapper.style.width = '100%'
		wrapper.appendChild(img)
		wrapper.appendChild(caption)
		overlay.appendChild(wrapper)
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) closeLightbox(overlay)
		});
		document.addEventListener('keyup', (e) => { if (e.key === 'Escape') closeLightbox(overlay); })
		document.body.appendChild(overlay)
		return overlay
	}

	function openLightbox(overlay, src, alt) {
		const img = overlay.querySelector('img')
		const caption = overlay.querySelector('div')
		img.src = src
		caption.textContent = alt || ''
		overlay.style.visibility = 'visible'
	}

	function closeLightbox(overlay) {
		overlay.style.visibility = 'hidden'
	}

	const donateSection = document.querySelector('#Donate')
	if (donateSection) {
		const list = donateSection.querySelector('ul')
		if (list) {
			const items = Array.from(list.querySelectorAll('li'))
				.map(li => ({ text: li.textContent.trim() }))
				.filter(it => /:\s*R?\d/.test(it.text))
			const parsed = items.map(it => {
				const m = it.text.match(/(\d{4})\s*:\s*R?([0-9,]+)/)
				if (!m) return null
				return { year: m[1], amount: parseInt(m[2].replace(/,/g, ''), 10) }
			}).filter(Boolean)
			if (parsed.length) renderBarChart(donateSection, parsed)
		}
	}

	function renderBarChart(container, data) {
		const max = Math.max(...data.map(d => d.amount))
		const canvas = document.createElement('canvas')
		canvas.width = 600; canvas.height = 300
		canvas.style.maxWidth = '100%'
		canvas.style.display = 'block'
		canvas.style.marginTop = '12px'
		container.appendChild(canvas)
		const ctx = canvas.getContext('2d')
		const padding = 40
		const chartWidth = canvas.width - padding * 2
		const barWidth = chartWidth / data.length * 0.6
		data.forEach((d, i) => {
			const x = padding + i * (chartWidth / data.length) + ((chartWidth / data.length) - barWidth) / 2
			const h = (d.amount / max) * (canvas.height - padding * 2)
			const y = canvas.height - padding - h
			ctx.fillStyle = '#4CAF50'
			ctx.fillRect(x, y, barWidth, h)
			ctx.fillStyle = '#000'
			ctx.font = '12px sans-serif'
			ctx.textAlign = 'center'
			ctx.fillText('R' + (d.amount).toLocaleString(), x + barWidth / 2, y - 6)
			ctx.fillText(d.year, x + barWidth / 2, canvas.height - padding + 16)
		})
		ctx.strokeStyle = '#ddd'; ctx.lineWidth = 1
		for (let i = 0; i <= 4; i++) {
			const yy = padding + i * ((canvas.height - padding * 2) / 4)
			ctx.beginPath(); ctx.moveTo(padding, yy); ctx.lineTo(canvas.width - padding, yy); ctx.stroke()
		}
	}

	const sections = document.querySelectorAll('section[id]')
	const navLinks = document.querySelectorAll('nav a[href^="#"]')
	navLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault()
			const href = link.getAttribute('href')
			const target = document.querySelector(href)
			if (target) {
				target.scrollIntoView({ behavior: 'smooth' })
				
			}
		})
	})

	if ('IntersectionObserver' in window && sections.length) {
		const obs = new IntersectionObserver(entries => {
			entries.forEach(ent => {
				const id = '#' + ent.target.id
				const link = document.querySelector('nav a[href="' + id + '"]')
				if (link) link.classList.toggle('active', ent.isIntersecting)
			})
		}, { threshold: 0.45 })
		sections.forEach(s => obs.observe(s))
	}
})
