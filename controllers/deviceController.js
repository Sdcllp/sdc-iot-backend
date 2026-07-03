import {
  publishCommand,
  sensorData,
  TOPICS
} from "../services/mqttService.js";

export const getDeviceData = async (req, res) => {
  try {
    res.json({
      success: true,
      data: sensorData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch device data",
      error: error.message,
    });
  }
};

export const controlLight = async (req, res) => {
  try {

    const { state } = req.body;

    const normalizedState =
      String(state).toUpperCase();

    if (
      !["ON", "OFF"]
      .includes(normalizedState)
    ) {
      return res.status(400).json({
        success:false,
        message:"Invalid light state",
      });
    }

    await publishCommand(
      TOPICS.LIGHT_SET,
      normalizedState
    );

    sensorData.light =
      normalizedState;

    sensorData.updatedAt =
      new Date().toISOString();

    res.json({
      success:true,
      message:
      `Light turned ${normalizedState}`,
      data:sensorData,
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:"Failed to control light",
      error:error.message,
    });

  }
};

export const controlAC = async (
req,
res
) => {

try{

const {state}=req.body;

const normalizedState=
String(state).toUpperCase();

if(
!["ON","OFF"]
.includes(normalizedState)
){

return res.status(400)
.json({

success:false,
message:"Invalid AC state",

});

}

await publishCommand(
TOPICS.AC_SET,
normalizedState
);

sensorData.ac=
normalizedState;

sensorData.updatedAt=
new Date().toISOString();

res.json({

success:true,

message:
`AC turned ${normalizedState}`,

data:sensorData,

});

}catch(error){

res.status(500).json({

success:false,

message:
"Failed to control AC",

error:error.message,

});

}

};

export const controlACTemp =
async(req,res)=>{

try{

const {temp}=req.body;

const num=
Number(temp);

if(
Number.isNaN(num)
||
num<16
||
num>30
){

return res.status(400)
.json({

success:false,

message:
"Temperature must be between 16 and 30",

});

}

await publishCommand(
TOPICS.AC_TEMP_SET,
num
);

sensorData.acTemp=
num;

sensorData.updatedAt=
new Date().toISOString();

res.json({

success:true,

message:
`AC temperature set to ${num}`,

data:sensorData,

});

}catch(error){

res.status(500).json({

success:false,

message:
"Failed to set AC temperature",

error:error.message,

});

}

};

export const controlPanasonicAC =
async(req,res)=>{

try{

const {state}=req.body;

const normalizedState=
String(state).toUpperCase();

if(
!["ON","OFF"]
.includes(normalizedState)
){

return res.status(400)
.json({

success:false,

message:
"Invalid Panasonic AC state"

});

}

sensorData.panasonicAc=
normalizedState;

sensorData.updatedAt=
new Date().toISOString();

res.json({

success:true,

message:
`Panasonic AC ${normalizedState}`,

data:sensorData

});

}catch(error){

res.status(500).json({

success:false,

message:
"Failed to control Panasonic AC",

error:error.message

});

}

};