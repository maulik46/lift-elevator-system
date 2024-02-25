const { createApp, ref, watch } = Vue
      
createApp({
    setup() {
        const floors = ref([5,4,3,2,1]);

        const callFloor = ref("");
        const currentFloor = ref(1);
        const liftFloorQueue = ref([]);

        const liftUp = ref(false);
        const liftDown = ref(false);

        const isGoDisabled = ref(false);

        const isStopLift = ref(false);

        const handleCallLift = (floor) => {
            liftFloorQueue.value.push(floor);
            isStopLift.value = false;

            startLift();
        }

        const setCurrentFloor = (floor) => {
            console.log('next..',floor);
            currentFloor.value = floor;
        }

        const removedReachedFloor = (floor) => {
            const restFloors = liftFloorQueue.value.filter(val => val != floor);
            liftFloorQueue.value = [];
            setTimeout(() => {
                liftFloorQueue.value = [...restFloors,...liftFloorQueue.value];
                startLift();
            }, 4000);
        }

        const startLift = () => {
            let isStartLift = setInterval(() => {
                console.log('startLift...');

                const floorQueue = liftFloorQueue.value;
                if(floorQueue.length <= 0){
                    console.log('0 floors...');
                    isStopLift.value = true;
                    clearInterval(isStartLift);

                    return false;
                }

                let current = currentFloor.value;
                var closestFloor = floorQueue.reduce(function(prev, curr) {
                    return (Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev);
                });

                if(closestFloor > current){
                    liftUp.value = true;
                    liftDown.value = false;
                }
                else {
                    liftUp.value = false;
                    liftDown.value = true;
                }

                console.log({current}, {closestFloor});
                console.log('isStopLift..',isStopLift.value);

                isStopLift.value = false;
                
                if(current == closestFloor){
                    console.log('arrived..');
                    removedReachedFloor(closestFloor);
                    isStopLift.value = true;
                    clearInterval(isStartLift);

                    return false;
                }

                if(liftUp.value){
                    console.log('go up..');
                    current=current+1;
                    if(current <= floors.value.length){
                        setCurrentFloor(current);
                    }
                    else{
                        isStopLift.value = true;
                        clearInterval(isStartLift);
                        
                        return false;
                    }
                    
                }
                else if(liftDown.value){
                    console.log('go down..');
                    current=current-1;
                    if(current > 0){
                        setCurrentFloor(current);
                    }
                    else{
                        isStopLift.value = true;
                        clearInterval(isStartLift);
                        
                        return false;
                    }
                }
                
            }, 2000);

        }

        const handleGoToFloor = (floor) => {
            handleCallLift(floor);
        }

        return {
            floors,
            currentFloor,
            callFloor,
            liftFloorQueue,
            isGoDisabled,
            liftUp,
            liftDown,
            isStopLift,
            setCurrentFloor,
            handleCallLift,
            handleGoToFloor,
            startLift,
        }
    }
}).mount('#app')