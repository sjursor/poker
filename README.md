Run app by 'npm start'


# poker oppgaver
Decken må være koblet til bordet.

Bordet må holde på rekkefølgen på folk.

Bordet må vite hvem som er dealer.

En klient må være en activePlayer, bordet har alle activePlayers.

activePlayer må kunne velges ved å klikke på et navn og så blir man den brukeren. Autentisering?



Backlog

Bord:
- Velg bord ved login/første besøk
- Flere bord

Bugs:
- Hvis spiller er allin, må han ikke bli talkingplayer
- Fortsatt litt bugs med talkingplayer som forsvinner av og til, ser ut som det skjer når spilleren etter dealer er folded
- Feil i utregning ved allin
- Vi kom i en situasjon der en spiller ikke hadde kort, til tross for refresh
- Nederste spillere har en skjevhet i gul ramme for talkingplayer
- Sørg for at knappene for fold/show alltid ligger på samme sted, nå flytter de seg når man er talking
- Problem med at det er mulig å trykke to ganger på deal/flop/turn/river når man er dealer, slik at to "actions" skjer etter hverandre
- For det visuelle hadde det vært fint om "sum round" alltid vises
- Det bør ikke være mulig å legge flop/turn/river hvis ikke alle enten har kastet, er allin, eller har bettet tilsvarende currentbet
- En spiller som blir kicket, må fjernes fra rekkefølgen slik at han ikke blir talkingplayer
- Settle pot bør tømme listen når ny runde starter, slik at ikke forrige rundes vinnere er selected når denne runden ikke har en vinner


	Tidligere notert:

	- Hvis har vært i 0 - utilstrekkelig konto for call

	Hold stell på antall buy-ins

	Funksjon for setPlayerToTalk

	



