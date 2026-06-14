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
	title: 'Welcome to Nextcloud Files',
	text: 'This quick tour will show you the key features of the Files app. Let\'s get started!',
	buttons: [
		{ text: 'Skip', action: tour.cancel, secondary: true },
		{ text: 'Next', action: tour.next },
	],
})

tour.addStep({
	id: 'navigation',
	title: 'File navigation',
	text: 'Use the sidebar to browse your files. You can switch between All files, Personal files, Recent, Favorites, Shares, Tags, and more.',
	attachTo: { element: '#app-navigation-vue', on: 'right' },
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
})

tour.addStep({
	id: 'search',
	title: 'Search files',
	text: 'Quickly find your files by typing in the search box. You can search by file name, content, or tags.',
	attachTo: { element: '#app-navigation-vue input[type="search"]', on: 'right' },
	canClickTarget: false,
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
	beforeShowPromise: function () {
		return new Promise(function (resolve) {
			waitForElement('#app-navigation-vue input[type="search"]', function () {
				resolve()
			})
		})
	},
})

tour.addStep({
	id: 'new-file',
	title: 'Create files & folders',
	text: 'Click here to create a new file, folder, or upload documents from your computer.',
	attachTo: { element: '.upload-picker button', on: 'bottom' },
	canClickTarget: false,
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
	beforeShowPromise: function () {
		return new Promise(function (resolve) {
			waitForElement('.upload-picker button', function () {
				resolve()
			})
		})
	},
})

tour.addStep({
	id: 'file-list-header',
	title: 'Sort your files',
	text: 'Click on Name, Size, or Modified column headers to sort your files. The active sort column is highlighted.',
	attachTo: { element: 'th.files-list__column--sortable', on: 'bottom' },
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
})

tour.addStep({
	id: 'file-row-actions',
	title: 'File actions',
	text: 'Hover over any file or folder to reveal actions: share with others, or click the three-dot menu for rename, move, delete, download, and more.',
	attachTo: { element: '.files-list__row-actions', on: 'left' },
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
	beforeShowPromise: function () {
		return new Promise(function (resolve) {
			waitForElement('.files-list__row-actions', function () {
				resolve()
			})
		})
	},
})

tour.addStep({
	id: 'view-toggle',
	title: 'View options',
	text: 'Toggle between list and grid view. Use the filter buttons to find files by type, modification date, or shared people.',
	attachTo: { element: 'button[aria-label="Switch to grid view"]', on: 'bottom' },
	canClickTarget: false,
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Next', action: tour.next },
	],
	beforeShowPromise: function () {
		return new Promise(function (resolve) {
			waitForElement('button[aria-label="Switch to grid view"]', function () {
				resolve()
			})
		})
	},
})

tour.addStep({
	id: 'settings',
	title: 'Settings & storage',
	text: 'Access your Files settings and check your storage usage from the bottom of the sidebar.',
	buttons: [
		{ text: 'Back', action: tour.back, secondary: true },
		{ text: 'Finish', action: tour.complete },
	],
	attachTo: { element: 'ul.app-navigation-entry__settings li:last-child a', on: 'right' },
	beforeShowPromise: function () {
		return new Promise(function (resolve) {
			waitForElement('ul.app-navigation-entry__settings li:last-child a', function () {
				resolve()
			})
		})
	},
})

tour.on('complete', function () {
	console.log('Intros: Tour completed')
})

tour.on('cancel', function () {
	console.log('Intros: Tour cancelled')
})

function startTour() {
	tour.start()
}

waitForElement('th.files-list__column--sortable', function (el) {
	if (el) {
		startTour()
	}
})
