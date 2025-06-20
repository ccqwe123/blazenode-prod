<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blazenode | Site is temporarily not available</title>
    <style>
        #preloader {
            inset: 0;
            gap: 4px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            z-index: 9999;
            position: fixed;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            background-color: var(--bs-dark);
            }
            @keyframes pulse-custom {
                0%, 100% {
                    transform: scale(1);
                    opacity: 1;
                    filter: drop-shadow(0 0 10px rgba(30, 12, 44, 0.9));
                }
                50% {
                    transform: scale(1.2);
                    opacity: 0.4;
                    filter: drop-shadow(0 0 20px rgba(30, 12, 44, 1));
                }
                }

                .animate-pulse-logo {
                animation: pulse-custom 1.5s ease-in-out infinite;
                }
    </style>
</head>
<body>
    <div id="preloader">
        <img 
            src="./assets/images/logo2.svg" 
            alt="Logo"
            class="w-20 h-20 animate-pulse-logo"
        />
    </div>
</body>
</html>