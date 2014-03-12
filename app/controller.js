app.controller("AppCtrl", function($scope, nodeApp) {
	
	$scope.logMessages = [];
	$scope.log = function(level, message, source) {
		var m = {level:level, message: message, source: source || "COLT"};
		$scope.logMessages.push(m);
		$scope.$emit("log", m);
	};

	for (var i = 0; i <= 50; i++) {
		$scope.log("WARNING", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, saepe dolore esse voluptatem sunt voluptate? Voluptas, aliquid, obcaecati odit dignissimos excepturi repudiandae assumenda quod nemo aliquam porro reiciendis enim odio doloribus magnam incidunt quas dolorem. Sequi, perspiciatis, quis ex quaerat commodi itaque nisi id odit quod distinctio similique ab quia blanditiis qui fuga quae dicta iste veniam beatae natus repellat aspernatur voluptatem laborum magnam esse fugit officiis amet maiores quibusdam quasi sint corporis dignissimos sit aliquid iure maxime ducimus unde voluptate consectetur minima error voluptatum nam accusamus enim debitis deleniti in consequatur voluptatibus temporibus eveniet! Est, reprehenderit, vero, quam ut nihil temporibus illum accusantium impedit inventore fugiat suscipit adipisci odit excepturi consequuntur assumenda omnis et provident? Quos error similique eligendi. Officiis, explicabo vero eaque rem officia illum magni exercitationem quibusdam unde commodi. Tempora, ipsa, commodi, possimus, quaerat alias iure modi quis neque voluptate aliquam architecto excepturi cupiditate illum repellendus deleniti velit libero. Dignissimos, ratione, delectus, quis minus cupiditate atque saepe tempore ad excepturi praesentium suscipit vitae repellat accusantium odit tempora ab doloribus. Quis, modi, alias, nesciunt eius tenetur doloribus sit mollitia rerum id delectus esse assumenda voluptatum minus dolores quasi dolor corporis saepe quam eaque aspernatur nostrum reiciendis accusamus neque ea illum explicabo ab cupiditate fugit architecto iure nobis nemo rem ad sequi perspiciatis consequuntur laborum! Eveniet, magni, neque qui veritatis error voluptates odio molestiae maxime ex fugiat doloribus vitae blanditiis inventore quisquam nostrum sint dolor at dicta ipsum atque dolore nisi excepturi numquam temporibus ducimus rem velit aspernatur repellat laudantium repudiandae officiis nemo expedita corporis. Mollitia, debitis, sapiente, praesentium dolores tenetur veritatis libero inventore perspiciatis quos quasi veniam culpa rem architecto ab cupiditate eum tempore consequatur nesciunt ipsam qui dolorum soluta ad! Mollitia, distinctio, deserunt, corporis dolorem dolores laudantium ipsam error reiciendis laborum aut dolor est ut vero eos fugit deleniti libero illo cumque recusandae nobis quidem optio enim quam adipisci earum veritatis consectetur suscipit! In, et, facere minima laboriosam eos illo error molestiae veritatis repellendus magnam quasi suscipit harum cum veniam cupiditate eaque nihil assumenda eligendi cumque dolore perspiciatis fugiat adipisci hic enim iste accusantium aperiam odio consequuntur doloremque culpa incidunt quia beatae recusandae ullam quidem nostrum autem aliquam iure ipsa minus voluptas quo voluptatem dicta reprehenderit temporibus quis? Adipisci, fuga, laboriosam voluptatem molestias harum earum vitae architecto sequi quasi at unde est nam repellat ut mollitia officia assumenda. Vel, quos, corporis minima earum assumenda obcaecati sunt quasi.", "index.html");
	};

	$scope.updateFilters = function() {
			var messages = $scope.logMessages;
			$scope.filter.errorsCount = messages.filter(function(e) {return e.level=="ERROR"}).length;
			$scope.filter.warningCount = messages.filter(function(e) {return e.level=="WARNING"}).length;
			$scope.filter.infoCount = messages.filter(function(e) {return e.level=="INFO"}).length;
			$scope.filter.liveCount = messages.filter(function(e) {return e.level=="LIVE"}).length;
	};

	$scope.filter = {};
	$scope.updateFilters();

	$scope.selectLogFilter = function(filter) {
		$scope.logFilter = filter;
	}

	$scope.session = {};
	$scope.sessionInProgress = false;
	$scope.startSession = function() {
		if($scope.session.sessionInProgress){
			console.log("stop session");
			nodeApp.sendToJava("stopSession");
		}else{
			console.log("start session");
			nodeApp.sendToJava("runSession");
		}
	};

	// node-webkit

	var nodeApp;

	if(top['require']){

		var gui = require('nw.gui'); 
		var win = gui.Window.get(); win.showDevTools();

		console.log("args: " + gui.App.argv);

		var startup = new Date().getTime();
		var spawn = require('child_process').spawn,

		java  = spawn('java', ['-jar', './java/colt.jar', '/Volumes/Archive/Projects/colt-ui/autogenerated.colt', '-ui'], {stdio:['ipc']});
		java.stdin.setEncoding = 'utf-8';

		java.on('close', function (code, signal) {
			console.log('child process terminated due to receipt of signal ' + signal);
			//win.close(true);
		});

		java.stdout.on('data', function (message) {
			try{
				message =  (message + "");
				message =  message.replace(/(\n|\r)+$/, "")
				message =  message.replace(/\\n/g, "\\n")
                                  .replace(/\\'/g, "\\'")
                                  .replace(/\\"/g, '\\"')
                                  .replace(/\\&/g, "\\&")
                                  .replace(/\\r/g, "\\r")
                                  .replace(/\\t/g, "\\t")
                                  .replace(/\\b/g, "\\b")
                                  .replace(/\\f/g, "\\f");

				if(message.length > 6){
					console.log(message);
					var header = message.substr(0, 6);
					console.log("--------------" + header + "|")
					if(header == "-json:"){
						try{
							var messageText = message.substr(6);
							var json = JSON.parse(messageText);
						}catch(e){
							console.log("error parse json: |" + messageText + "|");
							return;
						}
						if(json.type == "log"){
							$scope.logMessages.push(json);
							$scope.updateFilters();
						}else if(json.type == "runSession"){
							$scope.sessionInProgress = true;
						}else if(json.type == "stopSession"){
							$scope.sessionInProgress = false;
						}else if(json.type == "exec"){
							var exec = require('child_process').exec;
						    var child = exec(json.exec,
							  function (error, stdout, stderr) {
							    if(("" + stdout).length)$scope.log('INFO', stdout);
							    if(("" + stderr).length)$scope.log('ERROR', stderr);
							    if (error !== null) {
							      $scope.log("ERROR", 'exec error: ' + error);
							    }
							});
						}
						$scope.$emit(json.type, json);
					}

				}

			}catch(e1){
				console.log("!!!!! " + e1)
			}
		});

		java.stderr.on('data', function (message) {
			console.log('stderr: '+ message);
		});

		win.on('close', function() {
			java.kill();
			this.close(true);
		});

		// var tray = new gui.Tray({ title: '', icon: './icons/colt_32.png' });
		// var menu = new gui.Menu();
		// menu.append(new gui.MenuItem({ type: 'checkbox', label: 'box1' }));
		// tray.menu = menu;

		var fs = require('fs');
		var Q = require('q');
		var x2js = new X2JS();

		nodeApp = {
			loadProject : function(filePath){
				var d = Q.defer();
				fs.readFile(filePath, function(err, data) {
					if(err){
						d.reject(err);
					}else{
						var json = x2js.xml_str2json( data );
						d.resolve(json);
					}
				});
				return d.promise;
			},

			saveProject : function (filePath, data){
				var d = Q.defer();
				var xml = xml2js.json2xml(data);

				fs.writeFile(filePath, xml, function(err) {
					if(err) {
						d.reject(err);
					} else {
						d.resolve();
					}
				}); 
				return d.promise;
			},
			sendToJava: function(message) {
				java.stdin.write(message + "\n");
			}
		}

		nodeApp.loadProject("./test-project.colt").then(function(data) {
			console.log("PROJECT:");
			console.log(data);			
		});
	}


})