<?php

declare(strict_types=1);

namespace OCA\Intros\AppInfo;

use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCA\Intros\Listeners\FilesLoadAdditionalScriptsListener;
use OCA\Intros\Listeners\DashboardLoadAdditionalScriptsListener;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;

class Application extends App implements IBootstrap {
	public const APP_ID = 'intros';

	public function __construct(array $urlParams = []) {
		parent::__construct(self::APP_ID, $urlParams);
	}

	#[\Override]
	public function register(IRegistrationContext $context): void {
		$context->registerEventListener(LoadAdditionalScriptsEvent::class, FilesLoadAdditionalScriptsListener::class);
		$context->registerEventListener(BeforeTemplateRenderedEvent::class, DashboardLoadAdditionalScriptsListener::class);
	}

	#[\Override]
	public function boot(IBootContext $context): void {
	}
}
