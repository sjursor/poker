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

Bugz found på test 26.01.21:
	
	John:
	Fold må ta bort check-tegn

	Sjur:
	Call raise samme runde - bet legges pot - vanskelig å holde call på re-raise

	View amount betted this round

	- Hvis har vært i 0 - utilstrekkelig konto for call

	Farger på bet blir stående
		- bet/check oppdater farge

	Hold stell på antall buy-ins

	Funksjon for setPlayerToTalk

	check må sjekke om currentBet == 0 
	hvis ditt bet denne runden == currentBet 
	check is allowed



