pc.script.createLoadingScreen(function (app) {
    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);

        var logo = document.createElement('img');
        logo.src = '/icon.png';
        splash.appendChild(logo);

        // progress bar container
        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        // progress bar
        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);

        // Add more animated dots
        for (var j = 1; j <= 30; j++) {  // Increased the number of dots to 30
            var dot = document.createElement('div');
            dot.className = 'dot dot' + j;
            wrapper.appendChild(dot);
        }
    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);
    };

    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        if (bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };

    var createCss = function () {
        var css = [
            'body {',
            '    background: linear-gradient(180deg,rgb(5, 5, 5),rgb(24, 24, 24));', // Subtle gradient',
            '    overflow: hidden;', // Hide overflow for dots',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    display: flex;',
            '    justify-content: center;', // Centers horizontally',
            '    align-items: center;',     // Centers vertically',
            '    background: linear-gradient(270deg,rgb(26, 39, 42),rgb(23, 33, 35));', // Noticeable gradient
            '    background-size: 400% 400%;', // Make the swell effect more visible
            '    animation: backgroundSwell 15s ease infinite;', // Slower and more noticeable gradient swell
            '}',
            '',
            '#application-splash {',
            '    display: flex;',
            '    flex-direction: column;',
            '    align-items: center;', // Centers the logo and bar',
            '}',
            '',
            '#application-splash img {',
            '    width: 256px;', // Adjust the logo size as needed',
            '    margin-bottom: 10px;', // Space between logo and progress bar',
            '}',
            '',
            '#progress-bar-container {',
            '    width: 80%;', // Width of the progress bar container',
            '    height: 6px;', // Thicker progress bar',
            '    border-radius: 10px;',
            '    background-color:rgb(174, 174, 174);', // Lighter background for the bar',
            '    overflow: hidden;', // Ensures the bar stays within the container',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    border-radius: 10px;', // Rounded progress bar',
            '    background: linear-gradient(90deg,rgb(59, 118, 122),rgb(18, 92, 95));', // Gradient for the progress bar',
            '}',
            '',
            '@media (max-width: 480px) {',
            '    #application-splash img {',
            '        width: 150px;', // Smaller logo on smaller screens',
            '    }',
            '}',
            '',
            '/* Gradient Swell Animation */',
            '@keyframes backgroundSwell {',
            '    0% {',
            '        background-position: 0% 50%;',
            '    }',
            '    30% {',
            '        background-position: 100% 50%;',
            '    }',
            '    50% {',
            '        background-position: 0% 50%;',
            '    }',
            '}',
            '',
            '/* Dotted Graphics */',
            '.dot {',
            '    position: absolute;',
            '    width: 5px;',
            '    height: 5px;',
            '    background-color:rgb(39, 158, 150);', // Dark teal dots',
            '    border-radius: 50%;',
            '    opacity: 0.7;',
            '    animation: dotMove 5s infinite alternate;',
            '}',
            '',
            '@keyframes dotMove {',
            '    0% {',
            '        transform: translate(0, 0);',
            '    }',
            '    100% {',
            '        transform: translate(50px, 25px);',
            '    }',
            '}',
            '',
            // Positioning for more dots
            '.dot1 { left: 10%; top: 15%; animation-duration: 5s; }',
            '.dot2 { left: 20%; top: 30%; animation-duration: 6s; }',
            '.dot3 { left: 30%; top: 60%; animation-duration: 7s; }',
            '.dot4 { left: 40%; top: 20%; animation-duration: 8s; }',
            '.dot5 { left: 50%; top: 70%; animation-duration: 6s; }',
            '.dot6 { left: 60%; top: 40%; animation-duration: 9s; }',
            '.dot7 { left: 70%; top: 25%; animation-duration: 10s; }',
            '.dot8 { left: 80%; top: 50%; animation-duration: 6s; }',
            '.dot9 { left: 90%; top: 15%; animation-duration: 8s; }',
            '.dot10 { left: 15%; top: 50%; animation-duration: 9s; }',
            '.dot11 { left: 25%; top: 70%; animation-duration: 10s; }',
            '.dot12 { left: 35%; top: 25%; animation-duration: 7s; }',
            '.dot13 { left: 45%; top: 80%; animation-duration: 5s; }',
            '.dot14 { left: 55%; top: 50%; animation-duration: 8s; }',
            '.dot15 { left: 65%; top: 10%; animation-duration: 6s; }',
            '.dot16 { left: 75%; top: 40%; animation-duration: 9s; }',
            '.dot17 { left: 85%; top: 60%; animation-duration: 8s; }',
            '.dot18 { left: 5%; top: 20%; animation-duration: 7s; }',
            '.dot19 { left: 95%; top: 30%; animation-duration: 5s; }',
            '.dot20 { left: 20%; top: 10%; animation-duration: 8s; }',
            '.dot21 { left: 30%; top: 80%; animation-duration: 6s; }',
            '.dot22 { left: 50%; top: 15%; animation-duration: 9s; }',
            '.dot23 { left: 60%; top: 65%; animation-duration: 7s; }',
            '.dot24 { left: 75%; top: 30%; animation-duration: 10s; }',
            '.dot25 { left: 40%; top: 60%; animation-duration: 8s; }',
            '.dot26 { left: 80%; top: 75%; animation-duration: 9s; }',
            '.dot27 { left: 90%; top: 40%; animation-duration: 10s; }',
            '.dot28 { left: 10%; top: 65%; animation-duration: 7s; }',
            '.dot29 { left: 35%; top: 15%; animation-duration: 5s; }',
            '.dot30 { left: 55%; top: 25%; animation-duration: 8s; }'
        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };

    createCss();
    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});
