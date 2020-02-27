# B-Hackers Store - DB

Database of all apps in the Banana Hackers store. This is where the app fetches its data from.



## How to add a your app to this store

To add your app you need to create an file that describes it.
That file should have the name `[app id].yml` and be located in the `apps` folder.

the app id is the is the domain of the app reversed, for example:
'app.example.com' is going to be 'com.example.app' 

You can copy and fill out `example/app.template.yml`,
look at the other apps to see how the format works.

For storing/serving your opensource app we recommend github or gitlab releases.

Also look at our [documentation](./DOCUMENTATION.md).

## Abuse

If you see an app that
- steals your data
- contains malware
- or does other bad stuff with your device...

Please report that app in an gitlab issue and we'll look into it.