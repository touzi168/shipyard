#!/bin/bash
docker stop library-db
docker rm library-db
docker stop library-controller
docker rm library-controller

docker run -ti -d --name library-db rethinkdb

docker run -ti --name library-controller --link library-db:rethinkdb -p 80:80 -v  $PWD/controller/static:/static -v $PWD:/root --privileged=true ngaf.registry:5000/ngaf_compiler /bin/bash
