**写在前面**
> 个人感觉：javascript对类似排序查找这样的功能已经有了很好的封装，以致于当我们想对数组排序的时候只需要调用`arr.sort()`方法，而查找数组元素也只需要调用`indexOf()`方法或`lastIndexOf()`方法，我们忽略了其内部的实现。而今，js能开发的项目越来越庞大，对性能和效率要求也越来越高，虽然众多的库和框架也可以帮我们应付这些问题，但小编觉得框架过眼云烟，把握程序开发的基础，才能在飞速的更新换代中应对自如。因此我们不妨也研究一下这些算法，其中的思路有助于我们自身的提高。

<!-- MarkdownTOC -->

- [冒泡排序](#%E5%86%92%E6%B3%A1%E6%8E%92%E5%BA%8F)
- [选择排序](#%E9%80%89%E6%8B%A9%E6%8E%92%E5%BA%8F)
- [插入排序](#%E6%8F%92%E5%85%A5%E6%8E%92%E5%BA%8F)
- [快速排序](#%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F)
- [归并排序](#%E5%BD%92%E5%B9%B6%E6%8E%92%E5%BA%8F)
- [希尔排序](#%E5%B8%8C%E5%B0%94%E6%8E%92%E5%BA%8F)
- [堆排序](#%E5%A0%86%E6%8E%92%E5%BA%8F)
- [基数排序\(桶排序\)](#%E5%9F%BA%E6%95%B0%E6%8E%92%E5%BA%8F%E6%A1%B6%E6%8E%92%E5%BA%8F)
- [排序对比](#%E6%8E%92%E5%BA%8F%E5%AF%B9%E6%AF%94)

<!-- /MarkdownTOC -->

声明：本文章中的部分图片来自百度搜索，如侵删。

## 冒泡排序
这个是最简单的排序，就像气泡从水里冒出来。
它每执行一次外层循环，就会将最小数（或最大的）放到数组最后，然后再寻找剩余部分的最小数（或最大的）放在这一部分的最后，以此类推。
每一个外层循环的过程可以用一下图来描述：
![bubble](http://img.blog.csdn.net/20161025200702901)

冒泡排序的时间复杂度为$O(n^2)$，空间复杂度为$O(1)$，属于 **稳定** 排序。适用于数据比较少或基本有序的情况。
```javascript
//冒泡排序
bubbleSort = function(arr){
  var len = arr.length;
  for (var i = 0; i < len; i++){
    for (var j = 0; j < len - i - 1; j++){
      if (arr[j] > arr[j + 1])
        [arr[j + 1], arr[j]] = [arr[j],arr[j + 1]];
    }
  }
}
```
## 选择排序

选择排序也很简单。它每一次从待排序的数据元素中选出最小（或最大）的一个元素，存放在序列的起始位置，直到全部待排序的数据元素排完。下面是完整的选择排序过程：
![selection](http://img.blog.csdn.net/20161025195211770)

选择排序的时间复杂度为$O(n^2)$，空间复杂度为$O(1)$，属于 **稳定** 排序。适用于数据比较少的情况，综合各种情况来讲还是这个最慢。
```javascript
//选择排序
 selectionSort = function(arr){
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
}
```

## 插入排序
这个要略微复杂一点了。它的思路就是将一个数据插入到已经排好序的有序数据中，依然保持有序。实现过程把数组看作2部分，一部分是有序的，一部分是无序的，每次大循环将无序数组的第一个元素插入到有序的数组中。
![insertion](http://img.blog.csdn.net/20161025202526624)

插入排序时间复杂度为$O(n^2)$，空间复杂度为$O(1)$，属于 **稳定** 排序。算法适用于少量数据的排序。

<small>注：二分插入和直接插入各种情况复杂度一样</small>
```javascript
//直接插入排序
insertionSort = function (arr){
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
}
```
## 快速排序
这个想必大家都耳熟能详，20世纪十大经典算法之一。主要原因还是它极大的推动了信息技术的发展，可惜它不是稳定算法。
这个算法比较就比较难理解了，它通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的任一数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。这里面包含的分治的思想。
下面一个图表现了函数的一次执行过程：
![quick1](http://img.blog.csdn.net/20161025204837637)

而这个图表现了整个排序过程：

![quick2](http://img.blog.csdn.net/20161025204856497)

插入排序时间复杂度为$O(nlogn)$，空间复杂度为$O(logn)$，属于 **不稳定** 排序。
```javascript
////快速排序(前轴）
quickSort = function(arr){
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
}
```
*这里补充一下：快速排序由于其实轴的选择不同，分为前轴、中轴、后轴快速排序，上面的例子是前轴快速排序，下文比较算法的时候也才用上述代码。不过，这里补充另外2种代码：*
```javascript
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
}

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
}
```
## 归并排序
这个排序在小编眼里用的是最广泛的，很多函数封装内部都才用这个排序，包括数据库在内的排序也采用了归并排序或红黑树的形式。这个排序也用到了分治的思想：它将一个序列逐级拆分成小序列，将小序列排序后合并，得到完全有序的序列。若每次将序列分成2个子序列，再依此合并，称为二路归并。
没理解？看图：
![merge](http://img.blog.csdn.net/20161025213217906)

插入排序时间复杂度为$O(nlogn)$，空间复杂度为$O(n)$，属于 **稳定** 排序。
```javascript
//归并排序
mergeSort = function(arr){
  var temp = [];
  merge(arr, 0, arr.length - 1, temp);
  return arr;

  function merge(arr, left, right, temp){//temp是临时空间，存放排序过程中间结果
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
}
```
## 希尔排序
这是惟一一个用人名命名的排序算法。它把数据按下标的一定增量分组，对每组使用直接插入排序算法排序；随着增量逐渐减少，每组包含的关键词越来越多，当增量减至1时，整个文件恰被分成一组，算法便终止。
这个估计最不好理解了，看看图吧：
![shell](http://img.blog.csdn.net/20161025214534293)

插入排序时间复杂度为$O(n^\frac1{3})$，空间复杂度为$O(1)$，属于 **不稳定** 排序。
```
//希尔排序
shellSort = function(arr){
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
}
```
## 堆排序
首先说一下一个名词：大根堆。大根堆的要求是每个节点的值都不大于其父节点的值，即$A[PARENT[i]] \geq A[i]$， 属于完全二叉树。
根据大根堆的要求可知，最大的值一定在堆顶，根据其特点，如果要求每个节点的左孩子小于右孩子，得到的就是数据从小到大的排列。反之从大到小排列应该使用小根堆。
如果你对二叉树熟悉的话，可以简单用图理解一下
![heap](http://img.blog.csdn.net/20161026113116202)
插入排序时间复杂度为$O(nlogn)$，空间复杂度为$O(1)$，属于 **不稳定** 排序。
下面利用数组快速定位指定索引的元素模拟堆操作，并没有实际建立二叉树。
```javascript
//堆排序
heapSort = function(arr){
  var len = arr.length;
  for (var i = len / 2 - 1; i >= 0; i--)//反向遍历数组，将数组调整为大根堆
    heapAdjust(arr, i, len);
  for (var i = len - 1; i > 0; i--){
    [arr[0], arr[i]] = [arr[i], arr[0]];//将无需部分最大数放在最后，即构成有序部分
    heapAdjust(arr, 0, i);//将剩余无需部分调整为大根堆，直到该部分只有一个元素为止
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
}
```
## 基数排序(桶排序)
这个排序是对费空间的，不过这个思想有点像哈希表的意思。顾名思义，它是透过键值的部份资讯，比如每个数的最高位(如果位数不同在前方补零)，将要排序的元素分配至某些“桶”中，依次从低位到高位执行，然后再把每个桶的数据顺序综合起来，以达到排序的作用。就像下图这样，可以理解桶的意思：
![radix](http://img.blog.csdn.net/20161026115641454)

下图是整个排序过程示意图：
![radix2](http://img.blog.csdn.net/20161026120032273)

插入排序时间复杂度为$O(d(r+n))$，空间复杂度为$O(rd+n)$，属于 **稳定** 排序。（其中r为基数，n为数据总数，d为桶数；也有书得到其平均时间复杂度为$O(nlog_{r}d)$）
```
//基数排序(桶排序)
radixSort = function(arr){
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
    for (var i = 0; i < len; i++){
      for (var j = 0; j < 10; j++){
        for (var r = 0; r < num[j]; r++)
          arr[i++] = bullet[j][r];
      }
    }
    k *= 10;//k增加10倍，从右至左处理下一位数字
  }
  return arr;
}
```

## 排序对比
以上是常见的8种排序算法，小编也把结果写出来把。下面是10个随机数的排序效果：
![result](http://img.blog.csdn.net/20161026122026159)

当然还有算法速度，小编用了2万个均匀分布在0到10000的随机数，得到如下结果：
![time](http://img.blog.csdn.net/20161026142956364)

不过实际使用中，并不是越快越好，而且即便是追求快也和数据本身的质量有关系。就像下面这个表中的：
![complexity](http://img.blog.csdn.net/20161026122915390)

开发的时候应该综合排序原始数据状态，需求，稳定性，系统资源等诸多因素来确定使用哪种排序方式，也可一将几种排序组合使用以提高性能，比如小编就发现在快速排序中，当每个部分数据数量小于8时，对每个部分用插入排序就比一直使用快速排序更快。小编在找到一个动图，十分生动形象的表现了不同算法的速度上的差异。

![difference](http://img.blog.csdn.net/20161026123121094)



本章js源码可以 <a href="https://github.com/faremax1992/repoForBlog/blob/master/algorithm/src/sort.js" target="_blank">[点此去下载]

排序算法就写这么多，有什么不足还请指点。
