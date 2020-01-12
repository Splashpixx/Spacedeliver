![alt text](https://i.ibb.co/NNxzbwY/spaceicon.png)


## Group Members
* Radhouan Jouini
* Domenic Wolf

## Dev-Log
09.01.20
1. Es wurden 2 Weitere Api's angeschaut die jetzt verwendet werden
- Mailgun -> sendet dem nutzer nach der bestellung eine E-mail
- Stripe -> Nutzer kann dadurch alle "standart" zahlungsarten Nutzen.  

11.01.20  
1. Handlers haben einen eigenen ordner bekommen zur besseren übersicht (Auslagerung)  
2. handler-order und handler-menu wurde erstellt um die vorhandenen produkte anzuschauen, ~~handler-order besitzt bis jetzt nur die Post funktion mit der eine order.json erstellt wird (teilweise funktionieren)~~
man kann ab jetzt eine order erstellen, alle orders auflisten lassen und orders löschen.   

12.01.20
1. Implementierung von purchase-Handler, ~~problem beim Stripe Request :/~~ Stripe funktioniert jedoch ist das Mailgun konto gesperrt weil der key beim upload ausversehn noch dabei war (Gefixt muss auf Mailgun Support warten)

## Project description

Spacedeliver is a application that help people who can’t go grocery shopping.  
You can easily choose nearly everything from your local supermarket in our App.  
After you put everything you need in your shopping card a  Spacedeliverer who is near the next supermarket get your request and can buy the stuff you want,  
Then the Spacedeliverer payed at the checkout you get a push notification and the arrivel time, at the same time our deliverer get’s you address so he can bring the groceries to you.  
when your stuff arrived you can rate and tip our Spacedeliverer as well as send a report if you had any problem.  

## Manuel

### Basic scenario:

1. Create User (Users,POST)
2. Log in (Token,POST)
3. View item-list (menu,GET)
4. Order something (order,POST)

##### Comeing Soon

5. Pay your stuff (PURCHASE, POST)
....
N. Logout (Token, DEL)


## Domain Modell

### Version 1.0

![alt text](https://i.ibb.co/nQYktwL/Projects-10.jpg)

### Klassenmodel 2.0

![alt text](https://i.ibb.co/DkfjVxB/Projects-10-Kopie.jpg)

### Restbucks 1.0

![alt text](https://i.ibb.co/zGxGZRC/Projects-11.jpg)



