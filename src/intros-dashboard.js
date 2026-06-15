import Shepherd from 'shepherd.js'

var tour = new Shepherd.Tour({
	useModalOverlay: true,
	defaultStepOptions: {
		scrollTo: { behavior: 'smooth', block: 'center' },
		modalOverlayOpeningPadding: 4,
		modalOverlayOpeningRadius: 8,
	},
})

function waitForElement(selector, callback, maxAttempts) {
	maxAttempts = maxAttempts || 60
	var attempts = 0

	function check() {
		var el = document.querySelector(selector)
		if (el) {
			callback(el)
			return
		}
		attempts++
		if (attempts < maxAttempts) {
			setTimeout(check, 300)
		} else {
			console.warn('Intros: Element not found:', selector)
			callback(null)
		}
	}

	check()
}

tour.addStep({
	id: 'welcome',
	title: 'Welcome to Nextcloud',
	text: 'This is your Dashboard — the central hub of Nextcloud. From here you can quickly access your recent files, search across your cloud, and jump to any app.',
	buttons: [
		{ text: 'Skip', action: tour.cancel, secondary: true },
		{ text: 'Next', action: tour.next },
	],
})

tour.addStep({
	id: 'greeting',
	title: 'Personal greeting',
	text: 'Nextcloud greets you by name based on the time of day. A small touch to make your cloud feel like home.',
	attachTo: { element: '#app-dashboard h2:first-child', on: 'bottom' },
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
})

tour.addStep({
	id: 'recommended-files',
	title: 'Recommended files',
	text: 'Your recently accessed files appear here so you can pick up where you left off without navigating through folders.',
	attachTo: { element: '.panel--header', on: 'bottom' },
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
})

tour.addStep({
	id: 'file-shortcut',
	title: 'Quick file access',
	text: 'Click any recommended file to open it directly. No need to browse — just click and go.',
	attachTo: { element: 'a.recommendation', on: 'right' },
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
	beforeShowPromise: function () {
		return new Promise(function (resolve) {
			waitForElement('a.recommendation', function () {
				resolve()
			})
		})
	},
})

tour.addStep({
	id: 'search',
	title: 'Unified search',
	text: 'Use the universal search bar to find files, contacts, apps, settings, and more — all from one place.',
	attachTo: { element: '.unified-search-input__button', on: 'bottom' },
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
})

tour.addStep({
	id: 'apps-menu',
	title: 'Apps menu',
	text: 'Switch between your apps here. Install new ones from the App Store, or drag to reorder your favorites.',
	attachTo: { element: 'button[aria-label="Open apps menu"]', on: 'bottom' },
	canClickTarget: false,
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
})

tour.addStep({
	id: 'user-menu',
	title: 'Your account',
	text: 'Manage your profile, set your online status, install apps, configure settings, and log out — all from your user menu.',
	attachTo: { element: '#user-menu', on: 'bottom' },
	canClickTarget: false,
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
})

tour.addStep({
	id: 'customize',
	title: 'Customize your dashboard',
	text: 'Add, remove, or rearrange widgets to build a dashboard that works for you. Choose from weather, mail, calendar, and more.',
	attachTo: { element: '.footer button', on: 'top' },
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Finish', action: tour.complete },
	],
})

tour.on('complete', function () {
	console.log('Intros: Dashboard tour completed')
})

tour.on('cancel', function () {
	console.log('Intros: Dashboard tour cancelled')
})

function startTour() {
	tour.start()
}

waitForElement('#app-dashboard h2:first-child', function (el) {
	if (el) {
		startTour()
	}
})
