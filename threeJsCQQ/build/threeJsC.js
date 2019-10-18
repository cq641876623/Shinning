

function ThreeJsC(domParnet,configure) {
    var context=this;
    // 场景
    this.scene=null;
    // 相机
    this.camera=null;
    // 渲染器
    this.renderer=null;
    // 渲染dom
    this.dom=null;

    // 辅助控制器
    this.controls=null;


    this.composer = null;

    this.outlinePass=null;
    this.effectFXAA=null;


    var raycaster = new THREE.Raycaster();

    var mouse = new THREE.Vector2();


    var conf={
        dom: null,
        domParnet:document.body,
        style:{
            /**
             * type: 0:fullScreen,1:percent,3:px
             */
            width:{size:window.innerWidth ,type:0}
            , height:{size:window.innerHeight ,type:0}
        },
        composer:{
            switch:true,
        },
        defultScene:{
            background_type:0,
            background_imgUrl:[]
        },
        event:{
            selectFunction:null,
            clickFunction:null,
        }
    };


    /**
     * 导入配置信息
     * @param dom
     * @param c
     */
    function loadConf(c) {
            if(c==null)return;
            if(c.dom!=null){
                conf.domParnet=c.dom;
            }
            if(c.hasOwnProperty("style")){
                if(c.style.width!=undefined){
                    if(c.style.width!=""){
                        if(c.style.width.includes("%")){
                            conf.style.width.type=1;
                            conf.style.width.size=parseInt(c.style.width.substring(0,c.style.width.length-1));
                        }
                        else if(c.style.width.includes("px")){
                            conf.style.width.type=2;
                            conf.style.width.size=parseInt(c.style.width.substring(0,c.style.width.length-2));
                        }else {
                            conf.style.width.type=2;
                            conf.style.width.size=parseInt(c.style.width);
                        }
                    }
                }
                if(c.style.height!=undefined){
                    if(c.style.height!=""){
                        if(c.style.height.includes("%")){
                            conf.style.height.type=1;
                            conf.style.height.size=parseInt(c.style.height.substring(0,c.style.height.length-1));
                        }
                        else if(c.style.height.includes("px")){
                            conf.style.height.type=2;
                            conf.style.height.size=parseInt(c.style.height.substring(0,c.style.height.length-2));
                        }
                        else {
                            conf.style.height.type=2;
                            conf.style.height.size=parseInt(c.style.height);
                        }

                    }
                }

            }
            if(c.composer!=null){
                conf.composer.switch= c.composer['switch']==null?true:c.composer['switch'];
            }
            conf.event=c['event'];

        }


    var loadSize=function(size,t,dom){
        switch (size.type) {
            // 全屏
            case 0:
                if(t=="width")return window.innerWidth;
                if (t=="height")return window.innerHeight;
                // 百分比
            case 1:
                if(dom==null){
                    console.log("当前没有指定节点");
                    return 0;
                }else{
                    if(t=="width")return dom.clientWidth*(size.size/100);
                    if (t=="height")return dom.clientHeight*(size.size/100);
                }
            case 2:
               return  size.size;
        }
    }



    /**
     * 基本场景初始化函数
     * @param width dom宽度
     * @param height
     * @param dom 挂载节点
     * 不输入则为默认全屏
     */
    var init=function (domParnet) {
        // 支持检查
        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

        // 初始化场景
        context.scene = new THREE.Scene();
        // 初始化相机

        context.camera = new THREE.PerspectiveCamera( 45, loadSize(conf.style.width,"width",domParnet)/ loadSize(conf.style.height,"height",domParnet), 0.1, 1000 );
        // 渲染器
        context.renderer = new THREE.WebGLRenderer();

        context.renderer.setSize( loadSize(conf.style.width,"width",domParnet),loadSize(conf.style.height,"height",domParnet) );

        console.log("初始化宽高：","width:"+loadSize(conf.style.width,"width",domParnet)+","+"height:"+loadSize(conf.style.height,"height",domParnet));

        //阴影打开
        context.renderer.shadowMap.enabled = true;
        context.renderer.shadowMap.type = 0;
        console.log(context.renderer.domElement)
        conf.domParnet.appendChild( context.renderer.domElement );

        context.dom=context.renderer.domElement;
        conf.dom=context.renderer.domElement;


        context.scene.background = new THREE.Color( 0xffffff );
        if(conf.composer.switch) context.composer = new THREE.EffectComposer( context.renderer );



    }
    // 基本控制初始化函数
    var init_controls=function () {
        context.controls=  new THREE.OrbitControls( context.camera, context.renderer.domElement );
        context.controls.keys = {
            LEFT: 37, //left arrow
            UP: 38, // up arrow
            RIGHT: 39, // right arrow
            BOTTOM: 40 // down arrow
        }
        context.controls.mouseButtons={ORBIT: THREE.MOUSE.LEFT, ZOOM:THREE.MOUSE.RIGHT , PAN: THREE.MOUSE.MIDDLE};
        context.controls.update();
    }

    var defult_light=function(buler){
        if(buler){
            //默认灯光
            var light = new THREE.AmbientLight( 0xffffff ); // soft white light
            light.intensity=2;
            light.positionZ=200;
            // light.castShadow = true;
            context.scene.add( light );
        }
    }

    var defult_background=function(buler){
        if(!buler)return;
        var texture = new THREE.TextureLoader().load( "threeJsCQQ/static/backGround/天空球3.jpg" );
        context.scene.background =texture;
    }

    var defult_compose=function(buler){
        if(!buler)return;
        var renderPass = new THREE.RenderPass( context.scene, context.camera );
        context.composer.addPass( renderPass );
        context.outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), context.scene, context.camera );
        context.outlinePass.edgeStrength = 5;//包围线浓度
        context.outlinePass.edgeGlow = 0.5;//边缘线范围
        context.outlinePass.edgeThickness = 2;//边缘线浓度
        context.outlinePass.pulsePeriod = 2;//包围线闪烁频率
        context.outlinePass.visibleEdgeColor.set( '#ffffff' );//包围线颜色
        context.outlinePass.hiddenEdgeColor.set( '#190a05' );//被遮挡的边界线颜色

        context.composer.addPass( context.outlinePass );
        context.effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
        context.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / loadSize(conf.style.width,"width",conf.domParnet), 1 / loadSize(conf.style.height,"height",conf.domParnet) );
        context.effectFXAA.renderToScreen = true;
        context.composer.addPass( context.effectFXAA );
        console.log(context.composer)
    }

        /**
     * 运行渲染，默认为false
     * @param buler 简单无后处理 true:有后处理 ，false：无
     */
    var running=function(buler){
        function animateNoComposer() {
            requestAnimationFrame( animateNoComposer );
            context.controls.update();
            context.renderer.render( context.scene, context.camera );
        }

        function animateComposer() {
            requestAnimationFrame( animateComposer );
            checkIntersection();
            context.controls.update();
            context.composer.render();
        }
        if(buler){
            animateComposer();

        }else {
            animateNoComposer();
        }
    }








    /**
     * 窗口调整
     */
    var  onWindowResize=function() {
       context.camera.aspect = loadSize(conf.style.width,"width",conf.domParnet)/ loadSize(conf.style.height,"height",conf.domParnet);
       context.camera.updateProjectionMatrix();


       context.renderer.setSize( loadSize(conf.style.width,"width",conf.domParnet),loadSize(conf.style.height,"height",conf.domParnet) );

       if(conf.composer.switch){
           context.composer.setSize( loadSize(conf.style.width,"width",conf.domParnet),loadSize(conf.style.height,"height",conf.domParnet) );
           context.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / loadSize(conf.style.width,"width",conf.domParnet), 1 / loadSize(conf.style.height,"height",conf.domParnet) );
       }

       console.log("响应窗口变化：","width: "+conf.dom.clientWidth+" , "+"height: "+conf.dom.clientHeight);
    }



    var onTouchMove=function(event) {
        var x, y;
        if ( event.changedTouches ) {

            x = event.changedTouches[ 0 ].pageX;
            y = event.changedTouches[ 0 ].pageY;

        } else {

            x = event.clientX;
            y = event.clientY;

        }
        mouse.x = ( x / loadSize(conf.style.width,"width",conf.domParnet) ) * 2 - 1;
        mouse.y = - ( y / loadSize(conf.style.height,"height",conf.domParnet) ) * 2 + 1;


    }

    function checkIntersection() {

        raycaster.setFromCamera( mouse, context.camera );

        var intersects = raycaster.intersectObjects( context.scene.children, true );

        if ( intersects.length > 0 ) {
            context.outlinePass.selectedObjects.pop();
            var selectedObject = intersects[ 0 ].object;
            context.outlinePass.selectedObjects .push( selectedObject);
            if(conf.event!=null&&conf.event['selectFunction']!=null){
                conf.event.selectFunction(selectedObject);
                console.log('鼠标自定义移动事件挂载完成');
            }
        } else {
            context.outlinePass.selectedObjects.pop();
            // outlinePass.selectedObjects = [];

        }


    }


    function onClickObj(ev) {
        raycaster.setFromCamera( mouse,context.camera );

        // 计算物体和射线的焦点
        var intersects = raycaster.intersectObjects( context.scene.children,true );
        if(intersects.length > 0){
            console.log("点击事件触发",intersects[0]);
            if(conf.event!=null){
                conf.event['clickFunction'](ev,intersects[0].object);
                console.log("自定义点击事件挂载完成");
            }
        }
    }



    function  initEvent() {
        window.addEventListener( 'resize', onWindowResize, false );
        console.log("window事件挂载完成")
        if(context.composer!=null){
            context.dom.addEventListener( 'mousemove', onTouchMove,false );
            context.dom.addEventListener( 'touchmove', onTouchMove ,false);
            context.dom.addEventListener( 'click', onClickObj ,false);
        }
    }

    loadConf(domParnet,configure);
    // 基本场景初始化
    init(domParnet);
    // 基本控制初始化
    init_controls();

    defult_compose(conf.composer.switch);

    defult_light(true);


    defult_background(true);

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cube = new THREE.Mesh( geometry, material );
    context.scene.add( cube );


    context.camera.position.z = 10;
    initEvent();
    running(conf.composer.switch);











}

