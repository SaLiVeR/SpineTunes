<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">

        <link rel="stylesheet" href="css/style.css">

    </head>
    <body>
        <!--[if lt IE 10]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <header id="main-header">
            <div class="left-col logo" id="player"></div>
            <div class="right-col">
                <div id="soundcloud-power">
                    <a href="https://soundcloud.com" target="_blank">
                        <img src="images/soundcloud.png" alt="Powered by SoundCloud">
                    </a>
                </div>
                <div id="search-container"></div>
            </div>
        </header>

        <section id="main-content">
            <div class="left-col" id="playlist"></div>
            <div class="right-col" id="search-results"></div>
        </section>

        <footer id="main-footer">
            <a href="http://www.traviswimer.com">TravisWimer.com</a> &copy;2013
        </footer>


        <!-- Underscore Templates -->
        <script type="text/template" id="search-template">
            <input type="text" id="search-input" placeholder="Search" />
        </script>


        <script type="text/template" id="song-template">
            <div class="song">
                <img src="<%= trackInfo.artwork_url %>">
                <div class="song-info">
                    <div class="song-title">
                        <% if (!isSearchResult) { %>
                            <a href="<%= trackInfo.permalink_url %>" target="_blank">
                        <% } %>
                        <%= trackInfo.title %>
                        <% if (!isSearchResult) { %>
                            </a>
                        <% } %>
                    </div>
                    <div class="song-artist">
                        <% if (!isSearchResult) { %>
                            <a href="<%= trackInfo.user.permalink_url %>" target="_blank">
                        <% } %>
                        <%= trackInfo.user.username %>
                        <% if (!isSearchResult) { %>
                            </a>
                        <% } %>
                    </div>
                </div>
            </div>
        </script>


        <script type="text/template" id="player-template">
            <div class="play-btn"></div>
            <img src="<%= trackInfo.artwork_url %>">
            <div class="song-info">
                <div class="song-title">
                    <a href="<%= trackInfo.permalink_url %>" target="_blank">
                        <%= trackInfo.title %>
                    </a>
                </div>
                <div class="song-artist">
                    <a href="<%= trackInfo.user.permalink_url %>" target="_blank">
                        <%= trackInfo.user.username %>
                    </a>
                </div>
            </div>
        </script>
        <!-- /end Underscore Templates -->

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.9.1.min.js"><\/script>')</script>
        <script type="text/javascript" src="javascript/underscore-min.js"></script>
        <script type="text/javascript" src="javascript/backbone.js"></script>

        <script src="http://connect.soundcloud.com/sdk.js"></script>
        <script type="text/javascript" src="javascript/app.js"></script>
    </body>
</html>
