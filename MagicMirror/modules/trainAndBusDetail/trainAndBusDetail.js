wrapper = document.createElement("div");
		//assign class name to wrapper - this is necessary to override the massive padding/margins between
		//multiple stop definitions
		wrapper.className = "trainschedulediv";
		// create table
		var table = document.createElement("table");
		table.className = "trainstoptable";

		if (this.dataNotification) {
			if (this.dataNotification.train !== null) {
				let nLength = 0;
				try {
					if (this.dataNotification.train["trainDetail"] !== undefined && this.dataNotification.train["trainDetail"].eta !== undefined) {
						nLength = this.dataNotification.train["trainDetail"].eta.length;
					}
				} catch (oErr1) {
					//let the loop run, since it'll do nothing with length defaulted to 0
				}
				
				// Do the train content row with a loop
				for (i = 0, len = nLength; i < nLength; i++) {
					let sTrainIconColor = "inherit";
					if (this.config.trainIconColor.toLowerCase() != "auto") {
						sTrainIconColor = this.config.trainIconColor;
					} else {
						sTrainIconColor = this.dataNotification.train["trainDetail"].eta[i].rt.toUpperCase();
					}
					var arriveRow = document.createElement("tr");
					arriveRow.className = "xsmall";
					arriveRow.align = "left";

					//if first row, create first column as stop
					if (i == 0) {
						var stopNameCell = document.createElement("td");
						stopNameCell.innerHTML = this.config.trainStopName + "<br/>" + moment().format("HH:mm") + "";
						stopNameCell.rowSpan = this.config.maxResultTrain;
						stopNameCell.className = "medium trainstopname datalabel";						
						arriveRow.appendChild(stopNameCell);
					}
					
					//estimated arrival time first
					var arrivalArriveElement = document.createElement("td");
					var arrivalT = moment(this.dataNotification.train["trainDetail"].eta[i].arrT);
					var now = moment();
					var duration = moment.duration(arrivalT.diff(now));
					var arrivalTime = Math.round(duration.asMinutes());
					arrivalArriveElement.className = "trainETA trainETAfont";
					arrivalArriveElement.innerHTML = this.dataNotification.train["trainDetail"].eta[i].isDly == 0 ? "" : "! ";
					arrivalArriveElement.innerHTML += arrivalTime < 0 ? "LATE" : (arrivalTime == 0 ? "DUE" : (arrivalTime + " MIN").toUpperCase());
					arriveRow.appendChild(arrivalArriveElement);

					//train direction
					var arriveElement = document.createElement("td");
					arriveElement.innerHTML = this.dataNotification.train["trainDetail"].eta[i].destNm.toUpperCase().split("/")[0];
					arriveElement.className = "trainroutedestinationname trainETAfont";
					arriveRow.appendChild(arriveElement);

					//train type/line name
					var rtArriveElement = document.createElement("td");
					rtArriveElement.className = "trainETA trainETAfont";
					rtArriveElement.innerHTML += sTrainIconColor;
					arriveRow.appendChild(rtArriveElement);

					// Append trainArrivalRow into table!
					table.appendChild(arriveRow);
				}
			}
		};
		wrapper.appendChild(table);
		return wrapper;