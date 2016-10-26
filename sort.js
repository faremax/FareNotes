var sort = {
	//冒泡排序
	bubbleSort: function(arr){
		var len = arr.length;
		for (var i = 0; i < len; i++){
			for (var j = 0; j < len - i - 1; j++){
				if (arr[j]>arr[j + 1])
					[arr[j + 1], arr[j]] = [arr[j],arr[j + 1]];
			}
		}
	},
	//归并排序
	mergeSort: function(arr){
		var temp = [];
		merge(arr, 0, arr.length - 1, temp);
		return arr;

		function merge(arr, left, right, temp){//归并排序，temp是临时空间，存放排序过程中间结果
			var mid;//该部分中间位置
			if (left >= right)//分组小于等于1时归并结束
				return;
			mid = Math.floor((left + right) / 2);
			merge(arr, left, mid, temp);//对中间位置之前部分继续该方法排序
			merge(arr, mid + 1, right, temp);//对中间位置之后部分继续该方法排序
			var i = left, j = mid + 1, k = left;
			while (i != mid + 1 && j != right + 1)//比较两部分每个值，把较小的放入temp中，并后移该指针，直到某部分全部遍历
				temp[k++] = arr[i] < arr[j] ? arr[i++] : arr[j++];
			//将未全部遍历部分数据顺次放入temp中
			while (i != mid + 1)
				temp[k++] = arr[i++];
			while (j != right + 1)
				temp[k++] = arr[j++];
			//将temp复制会a中
			for (i = left; i <= right; i++)
				arr[i] = temp[i];
		}
	},
	//快速排序（递归）
	//前轴快速排序
	quickSortF: function(arr){
		qSort(arr, 0, arr.length - 1);
		return arr;
		
		function qSort(arr, left, right){
			if (left >= right)//两个数相遇则结束该轮排序
				return;
			var key = arr[left];//取最左边的元素作为标识数
			var i = left;
			var j = right;
			while (i != j){//两个数相遇则结束该轮排序
				while (i != j && arr[j] >= key) j--;//j前移
				[arr[j], arr[i]] = [arr[i], arr[j]];
				while (i != j && arr[i] <= key) i++;//i后移
				[arr[j], arr[i]] = [arr[i], arr[j]];
			}
			qSort(arr, left, j - 1);//对标识数前面的数继续该方法排序
			qSort(arr, j + 1, right);//对标识数后面的数继续该方法排序
		}
	},
	//中轴快速排序
	quickSortM: function(arr){
		qSort(arr, 0, arr.length - 1);
		return arr;
		
		function qSort(arr, left, right){
			if (left < right){
				var index = Math.floor((left + right) / 2);
				var key = arr[index];
				var i = left - 1;
				var j = right + 1;
				while (true){
					while (arr[++i] < key); // 向右找大于轴的数
					while (arr[--j] > key); // 向左找小于轴的数
					if (i >= j)//两索引相同结束排序
						break;
					[arr[i], arr[j]] = [arr[j],arr[i]];//交换找到的数
				}
				qSort(arr, left, i - 1); // 继续这样对轴前面的排序
				qSort(arr, j + 1, right); // 继续这样对轴后面的排序
			}
		}
	},
	//后轴快速排序
	quickSortB: function(arr){
		qSort(arr, 0, arr.length - 1);
		return arr;
		
		function qSort(arr, left, right){
			if (left >= right)//两索引相同结束排序
				return;
			var key = arr[right];
			var i = left - 1;//s是最右边的轴
			for (var j = left; j < right; j++){ //将数据分成大于轴和小于轴两部分
				if (arr[j] <= key){
					i++;
					[arr[i], arr[j]] = [arr[j],arr[i]];
				}
			}
			i++;
			[arr[right], arr[i]] = [arr[i],arr[right]];//将轴插入到大于轴和小于轴两部分的中间
			qSort(arr, left, i - 1);//继续这样对轴前面的排序
			qSort(arr, i, right);//继续这样对轴后面的排序
		}
	},
	//希尔排序
	shellSort: function(arr){
		var len = arr.length;
		var index = Math.floor(len / 2);//得到比较步长
		var j, temp;
		while (index > 0){
			for (var i = index; i < len; i++){//遍历起点后移，保证每个数在该步长下参与且只参与1此排序
				temp = arr[i];
				for (j = i; j >= index && arr[j - index] > temp;){//等步长数列执行插入排序
					arr[j] = arr[j - index];
					j -= index;
					arr[j] = temp;
				}
			}
			index = Math.floor(index / 2);//步长减半
		}
	},
	//选择排序
	 selectionSort: function(arr){
		var len = arr.length;
		var min, min_index;//min每次找到的最小值，min_index最小值在无序序列的位置
		for (var i = 0; i < len - 1; i++){
			min = arr[i];
			for (var j = i + 1; j < len; j++){//找到最小值
				if (arr[j] < min){
					min = arr[j];//找到的最小值
					min_index = j;//找到的最小值索引
				}
			}
			if (min != arr[i])
				[arr[min_index], arr[i]] = [arr[i], arr[min_index]];
		}
	},
	//插入排序
	insertionSort: function (arr){
		var len = arr.length;
		var temp;//temp每次要执行插入的值
		var index;//index插入值在有序序列的位置
		for (var i = 1; i < len; i++){
			temp = arr[i];
			for (var j = 0; j < i; j++){//找到插入位置
				index = i;
				if (arr[j] > temp){
					index = j;//找到的插入点索引
					break;
				}
			}
			if (i != index){
				for (var j = i; j > index; j--)//插入该值
					[arr[j - 1], arr[j]] = [arr[j],arr[j - 1]];
			}
			arr[index] = temp;
		}
	},
	//基数排序(桶排序)
	radixSort: function(arr){
		var len = arr.length;
		var bullet= [];
		var k=1, temp;//k是处理数字的权重，k=1表示处理个位数，k=10表示处理十位数，以此类推
		for (var i = 0; i < 10; i++)//为每个桶分配内存空间
			bullet[i] = [];
		while (true){
			var num = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];//num用来统计0~9每个桶里面现有数字个数
			for (var i = 0; i < len; i++){//统计分配每个数字到桶里面，并统计每个桶数字个数
				temp = Math.floor(arr[i] / k) % 10;
				bullet[temp][num[temp]++] = arr[i];
			}
			if (num[0] == len) break;//当全部数字都在编号为0的桶中，排序结束
			//将桶里的数依次放回a数组中
			for (var i = 0; i < len; ){
				for (var j = 0; j < 10; j++){
					for (var r = 0; r < num[j]; r++)
						arr[i++] = bullet[j][r];
				}
			}
			k *= 10;//k增加10倍，从右至左处理下一位数字
		}
		return arr;
	},
	//堆排序
	heapSort: function(arr){
		var len = arr.length;
		for (var i = len / 2 - 1; i >= 0; i--)//反向遍历数组，将数组调整为大根堆
			heapAdjust(arr, i, len);
		for (var i = len - 1; i > 0; i--){
			[arr[0], arr[i]] = [arr[i], arr[0]];//将无需部分最大数放在最后，即构成有序部分
			heapAdjust(arr, 0, i);//将剩余无需部分调整为大根堆，知道该部分只有一个元素为止
		}
		return arr;

		function heapAdjust(arr, i, len){//二叉堆调整函数，负责将堆调整成大根堆（因为是增序排列）
			var child;//根孩子的索引
			var temp;
			//以等倍数间隔，调整堆为大根堆
			for (; 2 * i + 1 < len; i = child){
				child = 2 * i + 1;  //定位其左孩子
				if (child < len - 1 && arr[child + 1] > arr[child])//从其左右孩子中选择最大的孩子
					child++;
				if (arr[i] < arr[child])//如果自己比最大的孩子小，和该孩子交换
					[arr[child], arr[i]] = [arr[i], arr[child]];
				else
					break;
			}
		}
	},
}

