class IcarSdk {
    /**
      * @param {HTMLVideoElement} videoInput video component where we want to acquire the video
      * @param {string} type GENERAL | FACE | DOCUMENT | DOCUMENT_IDCARD | DOCUMENT_PASSPORT
      * @param {Object} optional
      * @param {number} optional.cameraIndex
      * @param {string} optional.pathImages
      * @param {boolean} optional.flip_video
      * @param {boolean} optional.getUserMediaAudio
      * @return {Promise<number>} A promise with index to use with IcarSDK.RESULT_VIDEO
      */
    async init(videoInput, type, optional = {}) {
        return new Promise((resolve) => {
            IcarSDK.video.initialize(videoInput, {
                modeCapture: this.getCaptureMode(type),
                callBackFeedBackFunction: resultFeedBack => resolve(resultFeedBack),
                ...optional
            })
        })
    }

    /**
      * @param {HTMLVideoElement} videoInput video component where we want to acquire the video.
      * @param {Object} optional
      * @param {function} optional.messageFpsFunction information about the phase that is the process: blinking eyes, smile or turn head.
      * @param {function} optional.messageFaceCaptureFunction information about the progress of the blinking
      * @param {number} optional.NUMBER_SEC_WAITING_STRING_PROCESS number, blinking test to check if the person is a real one or not. This process shows a previous message to inform about the things that user must to do. By default, this message is showed 3 seconds (-1 to disable it),
      * @param {boolean} optional.DISABLE_FACE_LIVENESS_CHECK faceCapture is destinated to check if the person that is in front of the camera is a real person or not, but, in the case that you only need to take a picture when a face is in front of the camera
      * @param {number} optional.MAX_ATTEMPTS number of attemps for each liveness method, by default, it is 3
      * @param {boolean} optional.USE_INTEROCULAR_DISTANCE uses the detection of the face, by default, to determine the distance between tha user and the camera, but it is possible to determine the distance (instead of the face detection) using the interocular distance.
      * @param {string} optional.fontText  of the information text over the video
      * @param {string} optional.colorText  of the information text over the video
      * @param {number} optional.positionCanvasTextInformation
      * @param {string} optional.colorBackground Background Layer Customization
      * @param {number} optional.alphaBackground Background Layer Customization
      * @param {string} optional.pathImages path where the faceCapture images are stored, by default the path of the images that faceCapture uses is ‘./img/’.
      * @param {number} optional.initial_zIndex start zIndex of the canvas that faceCapture will be create to show information. The default value is 50.
      * @return {Promise<{ answerResult, modeCapture, imageResult, hashCode }>}
      *
      */
    createFaceCapture(videoInput, optional = {}) {
        return new Promise((resolve, reject) => {
            try {
                IcarSDK.faceCapture.create(videoInput, this.requestFrameCallback, (answerResult, modeCapture, imageResult, hashCode) => {
                    resolve({ answerResult, modeCapture, imageResult, hashCode })
                }, optional)
            } catch {
                reject()
            }
        })
    }

    /**
      * @param {HTMLVideoElement} videoInput video component where we want to acquire the video.
      * @param {Object} optional
      * @param {function} optional.messageFeedbackFunction returns messageDC (messageDC. CODE (number from 1 to 5), messageDC.TEXT (little description of the problem))
      * @param {number} optional.width_document width of the document (in mm) that you want to capture. By default, it is 85.6.
      * @param {number} optional.height_document height of the document (in mm) that you want to capture. By default, 53.98.
      * @param {number} optional.marginPercent_frame percentage of margin around the frame in the image. By default, it is 0.1, which is a 10% of the image width or height.
      * @param {number} optional.initial_zIndex start zIndex of the canvas that documentCapture will be created to show information. By default, it is 50.
      * @param {number} optional.type_doc_selected you can choose one of the pre-establish templates (If width_document or height_document is defined, this option will be ignored.):
      * - IcarSDK.TYPE_DOC.IDCARD (width = 85.6, height = 53.98)
      * - IcarSDK.TYPE_DOC.PASSPORT (width = 125, height = 88)
      * @param {number} optional.MAX_ATTEMPTS number of attemps for each liveness method, by default, it is 3
      * @param {string} optional.fontText  of the information text over the video
      * @param {string} optional.colorText  of the information text over the video
      * @param {number} optional.positionCanvasTextInformation The position (in vertical)  The value must be between 0 and 1.0. The value indicates the position between the top and the bottom of the video. By default is 0.33.
      * @param {string} optional.colorBackground Background Layer Customization
      * @param {number} optional.alphaBackground Background Layer Customization
      * @param {string} optional.color_lineDetected Background Layer Customization
      * @param {string} optional.color_lineNotDetected Background Layer Customization
      * @param {string} optional.path_template_img The documentCapture module allows show an image inside the background layer. This image can be used as guide to put the document on the rectangle. The image template can be customized as follows:
      * @param {boolean} optional.flip_template_img By default, the template image is showed as the video style is defined. If the video is flipped, the template image is flipped too. But it can be disabled using this parameter
      * @param {boolean} optional.multiplicationFactorBlurring WebSDK makes a blurring test to verify if the image is blurred or not. By default is 1.0, but can be increased if we want to accept images with less quality, or decrease
      * @return {Promise<{ answerResult, modeCapture, imageResult, hashCode }>}
      *
      */
    createDocumentCapture(videoInput, optional = {}) {
        return new Promise((resolve, reject) => {
            try {
                IcarSDK.documentCapture.create(videoInput, this.requestFrameCallback, (answerResult, modeCapture, imageResult, roiData, hashCode) => {
                    resolve({ answerResult, modeCapture, imageResult, roiData, hashCode })
                }, optional)
            } catch {
                reject()
            }
        })
    }

    /**
          * Once the document capture has been created, even started, it is possible to change the options that have been entered in the documentCapture.create().
          * @param {object} options
          * @return {void}
      */
    reloadDocumentCaptureOptions(options = {}) {
        IcarSDK.documentCapture.reloadOptions(options)
    }

    /**
          * Automatically the template image is fixed to the size of the rectangle. During the document capture process is possible to hide, or to show, the image template
          * @param {boolean} show
          * @return {void}
      */
    toogleDocumentCaptureTemplateImage(show) {
        if (show) IcarSDK.documentCapture.showTemplateImage()
        else IcarSDK.documentCapture.hideTemplateImage()
    }

    /**
          * @param {function} onFrameReceivedCallback must to be the next parameters:
          * - imageData: frame of the video
          * - hashCode: hashCode of the image
          * @return {void}
      */
    requestFrameCallback(onFrameReceivedCallback) {
        IcarSDK.video.requestFrame(onFrameReceivedCallback)
    }

    /**
          * This method gets the number of available cameras
          * @return {Promise<number>}
      */
    getNumberOfCameras() {
        return new Promise((resolve) => {
            IcarSDK.video.getNumberOfCameras(resolve)
        })
    }

    /**
          * This method gets the list of available cameras
          * @return {Promise<Array<{id, label, Active}>>}
      */
    getListOfCameras() {
        return new Promise((resolve) => {
            IcarSDK.video.getListOfCameras(resolve)
        })
    }

    changeCamera(camera) {
        IcarSDK.video.changeCamera(camera)
    }

    /**
          * @param {string} type GENERAL | FACE | DOCUMENT | DOCUMENT_IDCARD | DOCUMENT_PASSPORT
          * @return {number} Index.
      */
    getCaptureMode(type) {
        return IcarSDK.MODE_CAPTURE[type]
    }

    /**
          * @returns {Object} CaptureMode = Capture mode map
          * @returns {number} CaptureMode.AUTO_TRIGGER
          * @returns {number} CaptureMode.AUTO_TRIGGER
      */
    getCaptureModeMap() {
        return IcarSDK.CaptureMode
    }

    /**
       * @returns {Object} RESULT_VIDEO
       * @returns {number} RESULT_VIDEO.OK
       * @returns {number} RESULT_VIDEO.NO_CAMERA_DEVICES
       * @returns {number} RESULT_VIDEO.NO_CAMERA_PERMISSION
       * @returns {number} RESULT_VIDEO.UNAVAILABLE_CAMERA
       * @returns {number} RESULT_VIDEO.UNSUPPORTED_BROWSER
       * @returns {number} RESULT_VIDEO.UNKNOWN_ERROR
       */
    getResultVideo() {
        return IcarSDK.RESULT_VIDEO
    }

    /**
       * @returns {Object} ResultProcess
       * @returns {string} ResultProcess.OK
       * @returns {string} ResultProcess.FAIL
       * @returns {string} ResultProcess.ATTEMPTS_EXCEEDED
       */
    getResultProcess() {
        return IcarSDK.ResultProcess
    }

    /**
          * @param {string} type GENERAL | FACE | DOCUMENT | DOCUMENT_IDCARD | DOCUMENT_PASSPORT
          * @return {number} Index.
      */
    getDocumentType(type) {
        return IcarSDK.TYPE_DOC[type]
    }

    /**
          * @return {boolean}
      */
    isInitialized() {
        IcarSDK.video.isInitialized()
    }

    /**
          * @param {string} type faceCapture | documentCapture | video
          * @return {void}
      */
    startCapture(type) {
        IcarSDK[type].start()
    }

    /**
          * @param {string} type faceCapture | documentCapture
          * @param {boolean} lastIframeProcessed if we want get the last frame processed when the stop function is call, we can use the boolean argument to indicate it. By default is 'false'
          * @return {void}
      */
    stopCapture(type, lastIframeProcessed = false) {
        IcarSDK[type].stop(lastIframeProcessed)
    }

    /**
          * @param {string} type faceCapture | documentCapture
          * @return {Promise<{ void | imgData }>}
      */
    captureManual(type) {
        return new Promise((resolve) => {
            if (type === 'documentCapture') {
                IcarSDK[type].manualTrigger()
                resolve()
            } else if (type === 'faceCapture') {
                IcarSDK.video.requestFrame((imgData) => {
                    resolve(imgData)
                })
            }
        })
    }

    /**
          * @return {void}
      */
    pause() {
        IcarSDK.video.pause()
    }

    /**
          * @return {void}
      */
    cleanUp() {
        IcarSDK.video.cleanUp()
    }

    /**
       * @returns {Object} auxRes
       * @returns {string} auxRes.label
       * @returns {number} auxRes.ratio
       * @returns {number} auxRes.width
       * @returns {number} auxRes.height
       */
    getResolutionVideo() {
        return IcarSDK.video.getResolutionVideo()
    }

    /**
       * This method returns true is the faceCapture process is running, or false if is stopped (and ready to be run again).
       * @return {boolean}
      */
    faceCaptureIsRunning() {
        return IcarSDK.faceCapture.isRunning()
    }
}

export default new IcarSdk()
