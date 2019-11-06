# Variant Podcast

Hosting og enkel webplayer for podcast for Variant. Podcasten har ansatte hos Variant som målgruppe men alle episoder ligger åpent, som det meste her i Variant.

Se webplayer på: https://podcast.variant.no

---

[Se hvordan du kan legge til i din podcast-app](https://medium.com/@joshmuccio/how-to-manually-add-a-rss-feed-to-your-podcast-app-on-desktop-ios-android-478d197a3770).

Legg til rss:

```
https://podcast.variant.no/feed.xml
```

---

## Legge til nye episoder

Foreløpig måte å legge ut nye episoder er å legge til mp3-fil i `./episodes/` og redigere `episodes.json` med korrekt metadata for deretter å kjøre:

```
npm run build
```

for å generere ny `feed.xml` med episodeinfo.

---

For å gjøre det bedre for de som eventuelt er med i podcasten er innholdet ikke lisensiert og kan ikke gjenbrukes uten eksplisitt samtykke av en representant av Variant.
