const https = require('https');
const url = require('url');

const replaceValues = (str, e) => {
  var ret_val = str;
  ret_val = ret_val.replace('$deviceId', e.deviceInfo.deviceId)
  ret_val = ret_val.replace('$remainingLife', e.deviceInfo.remainingLife)
  ret_val = ret_val.replace('$clickType', e.deviceEvent.buttonClicked.clickType)
  ret_val = ret_val.replace('$projectName', e.placementInfo.projectName)
  ret_val = ret_val.replace('$placementName', e.placementInfo.placementName)
  ret_val = ret_val.replace(/\$([\w]+)/g,function(){return e.placementInfo.attributes[RegExp.$1] || "No Attributes named: '"+RegExp.$1 + "' found"})
  return ret_val;
}

exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)
  var key = e.placementInfo.attributes.key
  if(key == null)
  {
    cb("key is not defined.")
  }
  var eventName = e.placementInfo.attributes.event || e.deviceEvent.buttonClicked.clickType
  eventName = replaceValues(eventName, e)
  if(eventName == null)
  {
    cb("coudl not find eventName")
  }
  var webhookUrl = "https://maker.ifttt.com/trigger/"+eventName+"/with/key/"+key
  console.log(webhookUrl)
  var webhookOptions = url.parse(webhookUrl)

  var a = e.placementInfo.attributes
  var values = []
  var data = {}
  for(var i=1 ; i<=3 ; i++)
  {
      values[i] = a["value"+i] || ""
      values[i] = replaceValues(values[i], e)
      data['value'+i] = values[i]
  }
  var body = JSON.stringify(data)
  console.log("sending: "+body+ " to " + webhookUrl)
  webhookOptions = {
    host: "maker.ifttt.com",
    path: "/trigger/"+eventName+"/with/key/"+key,
    method: "POST",
    port: "443",
    headers: {
      'Content-Type':'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }
  var req  = https.request (webhookOptions, function(res){
    if (res.statusCode === 200)
    {
      console.log('webhook succeeded')
      cb(null, true)
    }
    else {
      cb("webhook failed with "+res.statusCode)
    }
    return res;
  })
  req.write(body)
  req.end()
}