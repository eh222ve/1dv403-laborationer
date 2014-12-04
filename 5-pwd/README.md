# 5-PWD

Nedan föjer lite riktlinjer kring hur du kan skapa en egen applikation:

Din application behöver ärva från Window-objektet på följande sätt.

`MessageBoard.prototype = new Window();`

`MessageBoard.prototype.constructor = MessageBoard;`

`function MessageBoard(desktopObject, xPos, yPos) {`

`this.WindowConstruct(string AppName, bool resizable, desktopObject, xPos, yPos);`

Parametrarna som skickas med i konstruktorn till din app skall skickas med i `this.WindowConstruct()`

Det finns reserverade metodnamn i Windowobjektet som du inte bör skriva över.
Dessa är:

- EnableSelection
- DisableSelection
- WindowConstruct
    - Extra kontruktor för att ta in parametrar från din app
- setStatus
    - Tillåter dig att skriva meddelanden till statusraden på applikationen
- createHTML
    - Initierar HTML-strukturen för applikationen
- focusWindow
    - Fokuserar fönstret och flyttar det överst

All HTML-kod du vill ska visas skall appendas till `this.app`!

## Vill du ha en context-meny?
Sätt `this.ContextMenu` att returnera en array med valfritt antal ul-element. Koppla alla event och funktioner som vanligt i ditt objekt.