<?php

declare(strict_types=1);

namespace OCA\Intros\Listeners;

use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

class DashboardLoadAdditionalScriptsListener implements IEventListener {
	#[\Override]
	public function handle(Event $event): void {
		if (!$event instanceof BeforeTemplateRenderedEvent) {
			return;
		}

		if ($event->getResponse()->getApp() !== 'dashboard') {
			return;
		}

		Util::addStyle('intros', 'intros');
		Util::addScript('intros', 'intros-dashboard');
	}
}
