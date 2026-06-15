<?php

declare(strict_types=1);

namespace OCA\Intros\Listeners;

use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

class FilesLoadAdditionalScriptsListener implements IEventListener {
	#[\Override]
	public function handle(Event $event): void {
		if (!$event instanceof LoadAdditionalScriptsEvent) {
			return;
		}

		Util::addStyle('intros', 'intros');
		Util::addScript('intros', 'intros-files');
	}
}
