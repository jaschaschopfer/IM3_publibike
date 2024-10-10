<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Wo sind die Publibikes hin?</title>
    <link rel="stylesheet" href="/css/styles.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <main class="container">
        <!-- Header Section -->
        <header class="site-header">
            <h1>Wo sind die Publibikes hin?</h1>
        </header>

        <!-- Introduction Section -->
        <section class="intro" aria-labelledby="intro-heading">
            <h2 id="intro-heading" class="visually-hidden">Einführung</h2>
            <p>
                Du kennst das bestimmt: Im Marzili steht kein E-Bike mehr bereit, und für die Abfahrt 
                von Köniz an den Bahnhof findest du kein normales Velo. Subjektiver Frust oder tatsächlich so? 
                Verfolge jetzt im interaktiven Graphen, wie sich die Berner Publibikes im Verlauf des Tages in 
                verschiedene Höhenlagen umverteilen!
            </p>
        </section>

        <!-- Interactive Graph Section -->
        <section class="graph-section" aria-labelledby="graph-heading">
            <h2 id="graph-heading" class="visually-hidden">Interaktiver Graph</h2>

            <!-- Chart.js Canvas -->
            <canvas id="altitudeChart" width="900" height="400"></canvas>
        </section>

        <!-- Conclusion / Call to Action Section -->
        <section class="conclusion" aria-labelledby="conclusion-heading">
            <h2 id="conclusion-heading">Dynamic Pricing</h2>
            <p>
                Unser Lösungsvorschlag: E-Bikes billiger für Abfahrten und Velos zum Sparpreis für hoch, wenn die Lage zu kippen beginnt. 
                Damit würde Publibike einen Anreiz setzen, dass die Bikes sich selbständig wieder besser verteilen. Für den abendlichen 
                User ein Erfreuen und viel Logistikarbeit beim Unternehmen eingespart!
            </p>
            <p>
                Und hey, Publibike, wenn euch unsere Idee weiterhilft: Wir freuen uns über ein lebenslanges Publi-Abo ;)
            </p>
        </section>
    </main>
    <!-- JavaScript to Handle the Graph -->
    <script src="/js/scripts.js"></script>
</body>
</html>
