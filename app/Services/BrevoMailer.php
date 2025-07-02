<?php

namespace App\Services;

use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use GuzzleHttp\Client;

class BrevoMailer
{
    protected TransactionalEmailsApi $apiInstance;

    public function __construct()
    {
        $config = Configuration::getDefaultConfiguration()
            ->setApiKey('api-key', config('services.brevo.api_key'));

        $this->apiInstance = new TransactionalEmailsApi(
            new Client(),
            $config
        );
    }

    public function send(string $toEmail, string $toName, string $subject, string $htmlContent)
    {
        $email = new SendSmtpEmail([
            'sender' => [
                'name' => 'Blazenode',
                'email' => 'info@blazenode.io'
            ],
            'to' => [[
                'email' => $toEmail,
                'name' => $toName
            ]],
            'subject' => $subject,
            'htmlContent' => $htmlContent
        ]);

        return $this->apiInstance->sendTransacEmail($email);
    }
}
