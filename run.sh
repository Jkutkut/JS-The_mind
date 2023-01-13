#!/bin/bash

imageName="themind"
containerName="themind"
containerPortOut="4242"
containerPortIn="4242"

runFlags="--rm"

if [ ! "$#" = "2" ]; then
	echo "Usage: ./run.sh <build|run> <dev|production>"
	exit 1
fi

if [ ! "$1" = "build" ] && [ ! "$1" = "run" ]; then
	echo "run.sh: Invalid run type, use build or run"
	exit 1
fi

execType=$1

if [ ! "$2" = "dev" ] && [ ! "$2" = "production" ]; then
	echo "run.sh: Invalid type, use dev or production"
	exit 1
fi

containerType=$2

# ****** Build ******
echo "Building $imageName"
if [ "$containerType" = "dev" ]; then
	echo "docker build --target development -t ${imageName}:dev ."
	docker build --target development -t ${imageName}:dev .
else
	echo "docker build -t $imageName:latest ."
	docker build -t $imageName:latest .
fi

if [ "$execType" = "build" ]; then
	echo; echo;
	echo "Built OK"
	echo "You can run the container with:"
	if [ "$containerType" = "dev" ]; then
		echo "docker run ${runFlags} -p ${containerPortOut}:${containerPortIn} ${imageName}:dev"
	else
		echo "docker run ${runFlags} -p ${containerPortOut}:${containerPortIn} ${imageName}:latest"
	fi

	exit 0
fi

# ****** Run ******
echo "Running $imageName"
if [ "$containerType" = "dev" ]; then
	echo "docker run ${runFlags} --name ${containerName} -p ${containerPortOut}:${containerPortIn} ${imageName}:dev"
	docker run ${runFlags} --name ${containerName} -p ${containerPortOut}:${containerPortIn} ${imageName}:dev
else
	echo "docker run ${runFlags} --name ${containerName} -p ${containerPortOut}:${containerPortIn} ${imageName}:latest"
	docker run ${runFlags} --name ${containerName} -p ${containerPortOut}:${containerPortIn} ${imageName}:latest
fi

