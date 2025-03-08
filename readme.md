
## ¿De que se trata el proyecto? 🖼️

Este proyecto es una aplicación web con el enfoque popular juego en linea Pictionary. Los usuarios pueden crear salas, buscar salas, unirse a una sala y jugar en tiempo real con otros jugadores adivinando el dibujo


## Ejecutar el proyecto

```
   1: npm run install
   2: coviar el archivo .env.template a .env
   3: npm run dev
```

## Rutas existentes 
 ```
   /login -> El usuario ingresa su nombre de usuario
 ```
 ``` 
   /room -> El usuario busca una sala
 ```
 ```
   /game ->  El usuario accede al juego y usa el canvas para dibujar.
 ```  

## Funcionalidad de la app
El proyecto esta desarrollado con Programación Orientada a Objetos POO y utiliza Web Components Vanilla, actualmente, se encuentra en desarrollo, con la implementación de WebSockets para la conexión en tiempo real, aqui dejo el repositorio del backend que implementa Rest Web Socket https://github.com/Overidd/pictionary-game-restsocket

## Arquitectura
La aplicación sigue el enfoque de arquitectura limpia, asegurando un código modular, mantenible y escalable
La parte UI sigue el enfoque de los componentes como en react y react-ruter para la navegación. 

## Diseño del proyecto
[Ver el PDF](./design.pdf)
