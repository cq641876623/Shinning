

function ThreeJsC(dom) {
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


    /**
     * 基本场景初始化函数
     * @param dom 执行节点
     */
    var init=function (width,height) {
        // 支持检查
        // if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

        // 初始化场景
        context.scene = new THREE.Scene();
        // 初始化相机
        context.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
        // 渲染器
        context.renderer = new THREE.WebGLRenderer();
        context.renderer.setSize( window.innerWidth, window.innerHeight );

        //阴影打开
        context.renderer.shadowMap.enabled = true;
        context.renderer.shadowMap.type = 0;


        context.renderer.setSize( window.innerWidth, window.innerHeight );

        context.renderer.shadowMap.enabled = true;
        context.renderer.shadowMap.type = 0;
        document.body.appendChild( context.renderer.domElement );
        document.body.appendChild( context.renderer.domElement );

        context.dom=context.renderer.domElement;

        context.scene.background = new THREE.Color( 0xffffff );

        context.composer = new THREE.EffectComposer( context.renderer );



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



    var defult_compose=function(){
        var renderPass = new THREE.RenderPass( context.scene, context.camera );
        context.composer.addPass( renderPass );
        var outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), context.scene, context.camera );
        outlinePass.edgeStrength = 5;//包围线浓度
        outlinePass.edgeGlow = 0.5;//边缘线范围
        outlinePass.edgeThickness = 2;//边缘线浓度
        outlinePass.pulsePeriod = 2;//包围线闪烁频率
        outlinePass.visibleEdgeColor.set( '#ffffff' );//包围线颜色
        outlinePass.hiddenEdgeColor.set( '#190a05' );//被遮挡的边界线颜色

        context.composer.addPass( outlinePass );
        var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
        effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
        effectFXAA.renderToScreen = true;
        context.composer.addPass( effectFXAA );
        console.log(context.composer)
    }

        /**
     * 运行渲染，默认为false
     * @param buler 简单无后处理 true:简单 ，false：有后处理
     */
    var running=function(buler){
        function animateNoComposer() {
            requestAnimationFrame( animateNoComposer );
            // render();
            // composer.render();
            context.controls.update();
            context.renderer.render( context.scene, context.camera );
        }

        function animateComposer() {
            requestAnimationFrame( animateNoComposer );
            // render();
            // composer.render();
            context.controls.update();
            context.composer.render();
        }
        if(buler){
            animateNoComposer();
        }else {
            animateComposer();
        }
    }







    // 基本场景初始化
    init(dom);
    // 基本控制初始化
    init_controls();

    defult_compose();

    defult_light(true);



    defult_background(true);


    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cube = new THREE.Mesh( geometry, material );
    context.scene.add( cube );
    var texture = new THREE.TextureLoader().load( "threeJsCQQ/static/backGround/天空球3.jpg" );
    context.scene.background =texture;

    context.camera.position.z = 10;
    running(false);










}

