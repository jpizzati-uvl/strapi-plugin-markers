import React from "react"

const getImgStub = (e: React.ChangeEvent<HTMLInputElement>) => {
  const realUrl = e.target.value

  const imgStub = {
    "id": 0,
    "ext": ".jpg",
    "url": realUrl,
    "hash": "",
    "mime": "image/jpeg",
    "name": "",
    "size": 0,
    "type": "asset",
    "width": 0,
    "folder": {
      "id": 0,
      "name": "",
      "path": "",
      "pathId": 0,
      "createdAt": "",
      "updatedAt": ""
    },
    "height": 0,
    "caption": null,
    "formats": {
      "thumbnail": {
        "ext": ".jpg",
        "url": "",
        "hash": "",
        "mime": "image/jpeg",
        "name": "",
        "path": null,
        "size": 0,
        "width": 0,
        "height": 0,
        "public_id": ""
      }
    },
    "provider": "strapi-provider-upload-sftp-v3",
    "createdAt": "",
    "updatedAt": "",
    "folderPath": "",
    "previewUrl": null,
    "isSelectable": true,
    "alternativeText": null,
    "provider_metadata": null
  }


  return {
    ...e, target: { value: imgStub }
  }
}

export { getImgStub };