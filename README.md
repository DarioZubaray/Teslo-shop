# Next.js Telo Shop
Para correr localmente, se necesita la base de datos.
```
docker-compose up -d
```

* El -d, significa __detached__



## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__
* MongoDB URL Local:
```
MONGO_URL=mongodb://localhost:27017/teslodb
```

* Reconstruir los módulos de node y levantar Next
```
yarn install
yarn dev
```


## Llenar la base de datos con información de pruebas

Llamara:
```
http://localhost:3000/api/seed
```

### Postman Collection

Puedes ver los endpoints disponibles importando el siguiente archivo de postman en 
```
./postman/TesloNext.postman_collection.json
```
