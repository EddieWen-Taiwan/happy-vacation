<?php include("source/head.php"); ?>

<body>

	<?php include("source/header.php"); ?>

	<div id="calendar"></div>

	<div class="overlay">
		<div class="mask">
			<div class="row-1">
				<div class="left"></div>
				<div class="right"></div>
			</div>
			<div class="row-2">
				<div class="left"></div>
				<div class="right"></div>
			</div>
		</div>
		<div class="card">
			<div class="title">
				<div class="welcome">歡迎來到快樂假期</div>
			</div>
			<div class="content">
				<div class="question"><img src="images/retireDate.png" />退伍日期：</div>
				<input type="text" id="datepicker" />
			</div>
			<div class="ok">確 定</div>
		</div>
	</div>

	<div class="mobile v-mid">
		<div class="text">
			<img src="images/warning.png" />
			手機禁止
		</div>
	</div>

</body>

</html>


