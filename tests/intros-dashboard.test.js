import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'

const { mockTour } = vi.hoisted(() => ({
	mockTour: {
		addStep: vi.fn(),
		start: vi.fn(),
		cancel: vi.fn(),
		back: vi.fn(),
		next: vi.fn(),
		complete: vi.fn(),
		on: vi.fn(),
	},
}))

vi.mock('shepherd.js', () => ({
	default: {
		Tour: vi.fn().mockImplementation(function () { return mockTour }),
	},
}))

import Shepherd from 'shepherd.js'

const EXPECTED_STEPS = [
	{
		id: 'welcome',
		title: 'Welcome to Nextcloud',
		hasAttachTo: false,
	},
	{
		id: 'greeting',
		title: 'Personal greeting',
		hasAttachTo: true,
		attachTo: { element: '#app-dashboard h2:first-child', on: 'bottom' },
	},
	{
		id: 'recommended-files',
		title: 'Recommended files',
		hasAttachTo: true,
		attachTo: { element: '.panel--header', on: 'bottom' },
	},
	{
		id: 'file-shortcut',
		title: 'Quick file access',
		hasAttachTo: true,
		attachTo: { element: 'a.recommendation', on: 'right' },
		hasBeforeShowPromise: true,
	},
	{
		id: 'search',
		title: 'Unified search',
		hasAttachTo: true,
		attachTo: { element: '.unified-search-input__button', on: 'bottom' },
	},
	{
		id: 'apps-menu',
		title: 'Apps menu',
		hasAttachTo: true,
		attachTo: { element: 'button[aria-label="Open apps menu"]', on: 'bottom' },
	},
	{
		id: 'user-menu',
		title: 'Your account',
		hasAttachTo: true,
		attachTo: { element: '#user-menu', on: 'bottom' },
	},
	{
		id: 'customize',
		title: 'Customize your dashboard',
		hasAttachTo: true,
		attachTo: { element: '.footer button', on: 'top' },
	},
]

describe('Intros Dashboard Tour', () => {
	describe('Step definitions', () => {
		let steps

		beforeAll(async () => {
			document.body.innerHTML = '<div id="app-dashboard"><h2>Hello</h2></div>'
			await import('../src/intros-dashboard.js')
			steps = mockTour.addStep.mock.calls.map(c => c[0])
		})

		it('creates a Shepherd.Tour with modal overlay', () => {
			expect(Shepherd.Tour).toHaveBeenCalledTimes(1)
			expect(Shepherd.Tour).toHaveBeenCalledWith({
				useModalOverlay: true,
				defaultStepOptions: {
					scrollTo: { behavior: 'smooth', block: 'center' },
					modalOverlayOpeningPadding: 4,
					modalOverlayOpeningRadius: 8,
				},
			})
		})

		it('adds exactly 8 steps', () => {
			expect(steps).toHaveLength(8)
		})

		it('assigns unique step IDs', () => {
			const ids = steps.map(s => s.id)
			expect(new Set(ids).size).toBe(ids.length)
		})

		it('assigns step IDs in the correct order', () => {
			expect(steps.map(s => s.id)).toEqual(EXPECTED_STEPS.map(s => s.id))
		})

		it('gives every step a title and description text', () => {
			steps.forEach((step, i) => {
				expect(step.title).toBeTruthy()
				expect(step.text).toBeTruthy()
			})
		})

		it('gives every step a non-empty buttons array', () => {
			steps.forEach(step => {
				expect(Array.isArray(step.buttons)).toBe(true)
				expect(step.buttons.length).toBeGreaterThanOrEqual(2)
			})
		})

		it('has "Skip" as the first button of the first step (action: cancel)', () => {
			const first = steps[0]
			expect(first.buttons[0].text).toBe('Skip')
			expect(first.buttons[0].action).toBe(mockTour.cancel)
			expect(first.buttons[0].secondary).toBe(true)
		})

		it('has "Finish" as the last button of the last step (action: complete)', () => {
			const last = steps[steps.length - 1]
			const lastBtn = last.buttons[last.buttons.length - 1]
			expect(lastBtn.text).toBe('Finish')
			expect(lastBtn.action).toBe(mockTour.complete)
		})

		it('has "Back" buttons on every step except the first', () => {
			steps.forEach((step, i) => {
				if (i === 0) {
					expect(step.buttons.some(b => b.text === 'Back')).toBe(false)
				} else {
					const back = step.buttons.find(b => b.text === 'Back')
					expect(back).toBeDefined()
					expect(back.action).toBe(mockTour.back)
					expect(back.secondary).toBe(true)
				}
			})
		})

		it('has "Next" buttons on every step except the last', () => {
			steps.forEach((step, i) => {
				if (i < steps.length - 1) {
					const next = step.buttons.find(b => b.text === 'Next')
					expect(next).toBeDefined()
					expect(next.action).toBe(mockTour.next)
				}
			})
		})

		it('marks "Skip" and "Back" buttons as secondary', () => {
			steps.forEach((step, i) => {
				step.buttons.forEach(btn => {
					if (btn.text === 'Skip' || btn.text === 'Back') {
						expect(btn.secondary).toBe(true)
					}
				})
			})
		})

		it('sets correct attachTo selectors on the right steps', () => {
			EXPECTED_STEPS.forEach((expected, i) => {
				if (expected.hasAttachTo) {
					expect(steps[i].attachTo).toBeDefined()
					expect(steps[i].attachTo.element).toBe(expected.attachTo.element)
					expect(steps[i].attachTo.on).toBe(expected.attachTo.on)
				} else {
					expect(steps[i].attachTo).toBeUndefined()
				}
			})
		})
	})

	describe('beforeShowPromise selectors', () => {
		let steps

		beforeAll(async () => {
			document.body.innerHTML = '<div id="app-dashboard"><h2>Hello</h2></div>'
			await import('../src/intros-dashboard.js')
			steps = mockTour.addStep.mock.calls.map(c => c[0])
		})

		it('adds beforeShowPromise only on steps that wait for dynamic elements', () => {
			EXPECTED_STEPS.forEach((expected, i) => {
				if (expected.hasBeforeShowPromise) {
					expect(steps[i].beforeShowPromise).toBeDefined()
					expect(typeof steps[i].beforeShowPromise).toBe('function')
				}
			})
		})

		it('resolves beforeShowPromise when the element eventually appears', async () => {
			const stepWithPromise = steps.find(s => s.id === 'file-shortcut')
			expect(stepWithPromise).toBeDefined()

			const waitFn = stepWithPromise.beforeShowPromise
			const promise = waitFn()

			expect(promise).toBeInstanceOf(Promise)

			const el = document.createElement('a')
			el.className = 'recommendation'
			document.body.appendChild(el)

			await expect(promise).resolves.toBeUndefined()
		})

		it('does not add beforeShowPromise to steps that already have their element in DOM', () => {
			const greeting = steps.find(s => s.id === 'greeting')
			const welcome = steps.find(s => s.id === 'welcome')

			expect(greeting.beforeShowPromise).toBeUndefined()
			expect(welcome.beforeShowPromise).toBeUndefined()
		})
	})

	describe('Event handlers', () => {
		let events

		beforeAll(async () => {
			document.body.innerHTML = '<div id="app-dashboard"><h2>Hello</h2></div>'
			await import('../src/intros-dashboard.js')
			events = mockTour.on.mock.calls.map(c => ({ name: c[0], handler: c[1] }))
		})

		it('registers a "complete" event handler', () => {
			const ev = events.find(e => e.name === 'complete')
			expect(ev).toBeDefined()
			expect(typeof ev.handler).toBe('function')
		})

		it('registers a "cancel" event handler', () => {
			const ev = events.find(e => e.name === 'cancel')
			expect(ev).toBeDefined()
			expect(typeof ev.handler).toBe('function')
		})

		it('registers exactly 2 event handlers', () => {
			expect(events).toHaveLength(2)
		})
	})

	describe('Auto-start behavior', () => {
		beforeEach(() => {
			vi.clearAllMocks()
			vi.resetModules()
		})

		it('starts the tour when the dashboard heading exists in the DOM', async () => {
			document.body.innerHTML = '<div id="app-dashboard"><h2>Hello</h2></div>'
			await import('../src/intros-dashboard.js')
			expect(mockTour.start).toHaveBeenCalledTimes(1)
		})

		it('does NOT start the tour when the dashboard heading is missing', async () => {
			document.body.innerHTML = '<div><p>Not the dashboard page</p></div>'
			await import('../src/intros-dashboard.js')
			expect(mockTour.start).not.toHaveBeenCalled()
		})

		it('does NOT start the tour when the dashboard div exists but has no h2', async () => {
			document.body.innerHTML = '<div id="app-dashboard"><p>No heading</p></div>'
			await import('../src/intros-dashboard.js')
			expect(mockTour.start).not.toHaveBeenCalled()
		})
	})

	describe('Step IDs match known tour steps', () => {
		let steps

		beforeAll(async () => {
			document.body.innerHTML = '<div id="app-dashboard"><h2>Hello</h2></div>'
			await import('../src/intros-dashboard.js')
			steps = mockTour.addStep.mock.calls.map(c => c[0])
		})

		it('has step IDs that describe the expected tour flow', () => {
			const ids = steps.map(s => s.id)
			expect(ids).toEqual([
				'welcome',
				'greeting',
				'recommended-files',
				'file-shortcut',
				'search',
				'apps-menu',
				'user-menu',
				'customize',
			])
		})
	})
})
