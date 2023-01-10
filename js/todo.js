/*
    -newElement
    * id'si list olan elementi querySelector ile getirilir
    * yeni bir li elementi oluşturulur
    * dışarıdan gönderilen değerlerin içinde ki id'yi oluşturduğumuz li elementinin id'sine verilir
    * dışarıdan gönderilen değerlerin içinde ki content'i innerHTML olarak verilir ve kullanıcı arayüzde görebilir
    * dışarıdan gönderilen değerlerin içinde ki status eğer true ise className'ine checked verilir
    * id'si list olan elementin içine oluşturduğumuz li'yi append ederiz
    * li'nin içeriğine close button oluşturmak için bir span oluştururuz ve li'ye append ederiz
*/
const newElement = (values = null) => {
    const list = document.querySelector("#list");
    const toDoListChild = document.createElement("li");
    toDoListChild.id = values.id;
    toDoListChild.innerHTML = values.content;
    if (values.status) {
        toDoListChild.className = "checked";
    }
    list.appendChild(toDoListChild);

    const liChild = document.createElement("span");
    liChild.id = values.id;
    liChild.classList.add("close", "h-100", "p-3");
    liChild.innerHTML = "&times";
    toDoListChild.append(liChild);
};

/*
    -toastProcess
    * show fonksiyonu ile seçili elementin class'ını hide'dan show'a değiştiririz
*/
const toastProcess = {
    show: (element) => {
        element.className = element.className.replace("hide", "show");
    },
};

/*
    -localStorageProcess
    Read Fonksiyonu
    *  localStorage'dan gelen veriyi JSON.parse ile array içinde obje haline çeviririz
    Create Fonksiyonu
    * create fonksiyonu hem update hemde create için kullanılır
    * update'den geldiğini belirlemek için dışarıdan aldığı verinin türünü string mi diye kontrol ederiz
    * eğer string ise gelen datayı direkt olarak localStorage'da update eder
    * eğer string değilse yeni bir tane toDo ekliyor olacağız
    * (1)
    * localStorage üzerinde kaydolan verilen en büyük id'sini almak için ilk başta idleri mapliyoruz
    * map'ladiğimiz id'leri Math.max fonksiyonu sayesinde en büyük id'yi alıyoruz
    * Alınan en büyük id'yi 1 ile toplayıp yeni id'yi belirliyoruz
    * id'si task olan input[text] elementini alıyoruz
    * id'si task olan elementin value'sunu kontrol ediyoruz
    * eğer value boş ise toast yardımı ile hata mesajı gönderiyoruz
    * eğer value boş değil ise yeni toDo'muzu bir değişkene obje olarak atıyoruz
    * atanan yeni objeyi localStorage'dan getirdiğimiz array'in içine gönderiyoruz (push) ve güncelliyoruz
    * localStorage'dan getirdiğimiz array'i güncelledikten sonra localStorage'a tekrardan set ediyoruz
    * başarılı olduğuna dair toast yardımı ile bir mesaj gönderiyoruz
    * en son işlem olarak newElement fonksiyonunu çağırıp yeni bir tane li oluşturmasını sağlıyoruz
    * ---- her iki durum için ---- id'si task olan input[text]'in value'sunu boş hale getiriyoruz
    Update fonksiyonu
    * event'ten gelen değişkeninin tagName'ini kontrol edip update yapılıp yapılmadığına bakıyoruz
    * (2)
    * localStorage'dan gelen verileri map fonksiyonu yardımı ile event'ten gelen verinin hangisi olduğunu anlıyoruz
    * event'ten gelen id ile localstorage'dan gelen id eşit ise;
    * localStorage verilerin içinde ki status'u true ise false, false ise true'ya çeviriyoruz
    * event'ten gelen element'in class'ına 'checked' ekliyoruz
    Delete fonksiyonu
    * event'ten gelen değişkeninin tagName'ini kontrol edip delete yapılıp yapılmadığına bakıyoruz
    * (3)
    * localStorage'dan gelen verilerin içerisinde event'ten gelen verinin uyuşup uyuşmadığına bakıyoruz
    * uyuşan veri olduğunda ise array üzerinde ki index'ini alıyoruz
    * eğer index -1'den büyük ise (bu array içinde vardır demek)
    * array.splice yardımı ile array içinde o objeyi siliyoruz
    * tekrardan localStorage'a create yapıp güncelleme yapıyoruz
    * en son işlem olarak html üzerinde ilgili line'ı (elementi) remove fonksiyonu sayesinde siliyoruz
*/
const localStorageProcess = {
    read: () => {
        return JSON.parse(localStorage.getItem("toDoList"));
    },
    create: (values) => {
        if (typeof values === "string") {
            localStorage.setItem("toDoList", values);
        } else {
            const toDoList = localStorageProcess.read(); // (1) -localStorageProcess -> Read fonksiyonu
            const ids = toDoList.map((object) => {
                return object.id;
            });
            const id = Math.max(...ids) + 1;
            const content = document.querySelector("#task");
            if (content.value.trim() !== "") {
                const newValue = {
                    id: id,
                    content: content.value,
                    status: false,
                };
                toDoList.push(newValue);
                localStorage.setItem("toDoList", JSON.stringify(toDoList));
                toastProcess.show(document.querySelector("#liveToastSuccess"));
                newElement(newValue);
            } else {
                toastProcess.show(document.querySelector("#liveToastError"));
            }
            content.value = "";
        }
    },
    update: (e) => {
        if (e.target.tagName == "LI") {
            let toDoList = localStorageProcess.read(); // (2) -localStorageProcess -> Read fonksiyonu
            toDoList = toDoList.map((toDo) => {
                if (toDo.id == e.target.id) {
                    const currentElement = document.getElementById(e.target.id);
                    toDo.status = !toDo.status;
                    if (toDo.status) {
                        currentElement.className = "checked";
                    } else {
                        currentElement.className = "";
                    }
                }
                return toDo;
            });
            localStorageProcess.create(JSON.stringify(toDoList));
        }
    },
    delete: (e) => {
        if (e.target.tagName == "SPAN") {
            let toDoList = localStorageProcess.read(); // (3) -localStorageProcess -> Read fonksiyonu
            const objWithIdIndex = toDoList.findIndex((obj) => obj.id == e.target.id);
            if (objWithIdIndex > -1) {
                toDoList.splice(objWithIdIndex, 1);
                localStorageProcess.create(JSON.stringify(toDoList));
                document.getElementById(e.target.id).remove();
            }
        }
    },
};

/*
    -initialize fonksiyonu
    bu bölüm eğer localStorage'da hiçbir veri yoksa sahte veri olarak 5 tane to do list verir
 */

const initialize = () => {
    const toDoList = [{
            id: 1,
            content: "3 Litre Su İç",
            status: false,
        },
        {
            id: 2,
            content: "Ödevleri Yap",
            status: false,
        },
        {
            id: 3,
            content: "En Az 3 Saat Kodlama Yap",
            status: false,
        },
        {
            id: 4,
            content: "Yemek Yap",
            status: false,
        },
        {
            id: 5,
            content: "50 Sayfa Kitap Oku",
            status: false,
        },
    ];
    const localStorageData = localStorageProcess.read();
    if (localStorageData === null) {
        // Localstorage boş ise
        localStorage.setItem("toDoList", JSON.stringify(toDoList));
        toDoList.map((singleToDo) => {
            // yeni html element oluşturmak için toDoList array'ini mapliyoruz ve newElement fonksiyonuna gönderiyoruz
            newElement(singleToDo);
        });
    } else {
        // Eğer localStorage dolu ise LocalStorage'dan gelen verileri html elementi oluşturması için newElement fonksiyonuna gönderiyoruz
        localStorageData.map((singleToDo) => {
            newElement(singleToDo);
        });
    }
};
initialize();

// Ekle butonun hareketlerini gözlemlemek için addEventListener kullanıyoruz ve localStorage.create fonksiyonuna gönderiyoruz
const addToDoListButton = document.querySelector(".addToDoList");
addToDoListButton.addEventListener("click", localStorageProcess.create);

// list id'sinin içinde ki li'lerin hareketlerini gözlemlemek için addEventListener kullanıyoruz ve localStorage.update fonksiyonuna gönderiyoruz

const updateToDoList = document.querySelectorAll("#list > li");
updateToDoList.forEach((toDoList) => {
    // Her li için ayrı bir addEventListener açıyporuz
    toDoList.addEventListener("click", localStorageProcess.update);
});

// li içindeki span'ların(close button) hareketlerini gözlemlemek için addEventListener kullanıyoruz ve localStorage.delete fonksiyonuna gönderiyoruz
const deleteToDoList = document.querySelectorAll("li > span");
deleteToDoList.forEach((toDoList) => {
    // Her span için ayrı bir addEventListener açıyporuz
    toDoList.addEventListener("click", localStorageProcess.delete);
});