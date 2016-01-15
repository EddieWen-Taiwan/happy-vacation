<?php include("source/head.php"); ?>

<body>

	<?php include("source/header.php"); ?>

	<div id="calendar"></div>
	<div class="document">
		<a href="https://github.com/EddieWen-Taiwan/happy-vacation" target="_blank">使用文件</a>
	</div>

	<div class="overlay">
		<div class="card">
			<div class="title">
				<div class="welcome">歡迎來到快樂假期</div>
			</div>
			<div class="content">
				<div class="question"><div class="css-sprite retire"></div>退伍日期：</div>
				<input type="text" id="datepicker" />
				<div class="question"><div class="css-sprite work"></div>每次回來上勤我要上<div class="day-value">整天</div>班</div>
				<div class="radio-btns">
					<div class="options all-day valuable" data-day="all-day">
						<div class="radio">
							<div class="wave"></div>
							<div class="real-circle"></div>
						</div>
						<span class="text">整天</span>
					</div>
					<div class="options half-day" data-day="half-day">
						<div class="radio">
							<div class="wave"></div>
							<div class="real-circle"></div>
						</div>
						<span class="text">半天</span>
					</div>
				</div>
			</div>
			<div class="ok">確 定</div>
		</div>
	</div>

	<div class="alert">
		<div class="dialog animated">
			<div class="title">
				<div class="bad">不可以</div>
				<div class="good">提示</div>
			</div>
			<div class="content">
				<span class="not-allow-to-right">上勤日會重疊啦。</span>
				<span class="not-allow-to-left">這樣會連放太多假喔。</span>
				<span class="need-hours">共需要 <span class="value"></span> 小時的假。</span>
			</div>
			<div class="btn-row">
				<div class="fine">確定</div>
			</div>
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


