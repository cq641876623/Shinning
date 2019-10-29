# 3D-threeJs
基于threeJs常用函数的封装
旨在简化ThreeJs入门程度，于工作中可以快速熟悉，其中都是
1.快速场景搭建
2.选择交互
3.Node自适应
未完成...
由于工作原因后调开发

使用方法：
<!--主文件-->
<script src="threeJs/build/three.js"></script>
<!--检查webGL环境-->
<script src="threeJs/js/Detector.js"></script>

<script src="threeJs/js/loaders/LoaderSupport.js"></script>


<!--外部3D模型导入-->
<!--obj材质导入-->

<!--obj对象导入-->
<script src="threeJs/js/loaders/OBJLoader.js"></script>
<!--GLTF或GLB对象导入-->
<script src="threeJs/js/loaders/GLTFLoader.js"></script>

<!--辅助-->
<!--控制文件-->
<script src="threeJs/js/controls/OrbitControls.js"></script>

<!--鼠标点击交互事件辅助-->
<script src="threeJs/js/shaders/CopyShader.js"></script>
<script src="threeJs/js/shaders/FXAAShader.js"></script>
<script src="threeJs/js/postprocessing/EffectComposer.js"></script>
<script src="threeJs/js/postprocessing/RenderPass.js"></script>
<script src="threeJs/js/postprocessing/ShaderPass.js"></script>
<script src="threeJs/js/postprocessing/OutlinePass.js"></script>
<script src="threeJsCQQ/build/threeJsC.js"></script>

<script>
  var threejs=new ThreeJsC(dom,conf);
</script>

---------------------****************-----------------------



