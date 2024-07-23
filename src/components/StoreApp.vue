<template>
  <div class="d-flex align-center flex-column">
    <v-row class="pa-10">
      <v-tabs>
        <!-- -------------------------------------Store Form--------------------------------------------------------------------------------------------- -->
        <v-tab href="#createStore">
          Create Store
        </v-tab>
        <v-tab-item value="createStore">
          <v-form lazy-validation ref="form">
            <v-card class="pa-10">
              <v-card-title>
                Create a Store
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-text-field :rules="[rules.required]" v-model="storeName" label="Store Name" outlined
                      dense></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field :rules="[rules.required]" v-model="storeCategory" label="Category" outlined
                      dense></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="saveStore()" color="primary" :loading="loadingBtnStore">
                  Save store
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
          <v-card class="mt-5" width="50vw">
            <v-data-table :items-per-page="5" :headers="headersStore" :loading="loading" :items="itemsStore">
            </v-data-table>
          </v-card>
        </v-tab-item>
        <!-- -------------------------------------------------Product Form--------------------------------------------------------------------------------- -->
        <v-tab href="#createProduct">
          Create Product
        </v-tab>
        <v-tab-item value="createProduct">
          <v-form lazy-validation ref="formProduct">
             <v-card elevation="8" class="pa-10">
              <v-card-title>
                Enter a product
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-text-field :rules="[rules.required]" v-model="productName" label="Product Name" outlined
                      dense></v-text-field>
                  </v-col>
                  <v-col>
                    <v-textarea :rules="[rules.required]" v-model="Description" label="Description" outlined dense
                      auto-grow rows="2" row-height="15">
                    </v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field :rules="[rules.onlyNumber, rules.required]" v-model="price" label="Price"
                      type="number" outlined dense></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-select :rules="[rules.required]" v-model="storeID" :items="storeItems" label="Select Store"
                      item-text="name" item-value="value" outlined dense></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :loading="loadingBtnProduct"  @click="saveProduct()" color="primary">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
          <v-col>
            <v-card class="mt-5" width="50vw">
              <v-data-table :items-per-page="5" :headers="headers" :loading="loadingP" :items="items">
              </v-data-table>
            </v-card>
          </v-col>
          <!-- ---------------------------------------------------------------------------------------------------------------------------------- -->
        </v-tab-item>
      </v-tabs>
    </v-row>
    <v-snackbar color="green" v-model="snackbar" :timeout="2000">
      {{ textSnackbar }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      storeName: '',
      snackbar: false,
      textSnackbar: '',
      storeCategory: '',
      itemsStore: [],
      loading: false,
      loadingP: false,
      headersStore: [
        { text: 'Store Name', value: 'storename', sortable: false, class: 'FixCols' },
        { text: 'Category', value: 'categorys', sortable: false },
      ],
      storeID: '',
      storeItems: [],
      productName: '',
      Description: '',
      price: 0,
      Authtoken: "412da268fa8e2241ecd77e1c7fd15a",
      items: [
        { "ProductName": "1jk29 - Jersey NFL - 0001234", "Description": "Local Jersey Replica", "price": "2100.50", "store": "Steelers" },
        { "ProductName": "123js - Jersey UL - 0003456", "Description": "Alternativo Retro", "price": "1650.50", "store": "UL" },
        { "ProductName": "kj231 - Balon Americano - 000151", "Description": "Balon Cuero Football", "price": "300.50", "store": "Steelers" },
        { "ProductName": "lp09 - Jersey Soccer - 000340", "Description": "Local Jersey", "price": "1222.50", "store": "Santos" },

      ],
      headers: [
        { text: 'Product Name', value: 'ProductName', sortable: false, class: '' },
        { text: 'Description', value: 'Description', sortable: false },
        { text: 'Price', value: 'price' },
        { text: 'Store', value: 'store' },
      ],
      loadingBtnStore: false,
      loadingBtnProduct:false,
      rules: {
        onlyNumber: value => /^\d+$/.test(value) || 'Just numbers allowed',
        required: value => !!value || 'Field Can´t be empty',
      }
    }
  },
  async mounted() {
    //Fetch the Store in order to fill the Table and the select field
    await this.fetchStore();
  },
  methods: {
    async saveStore() {
      //Create the Store
      if (this.$refs.form.validate()) {
        this.loadingBtnStore = true;
        let data = {
          name: this.storeName,
          category: this.storeCategory
        };

        let config = {
          method: 'post',
          url: 'http://localhost:8081/api/stores',
          data: data
        };

        axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            this.fetchStore();
            this.loadingBtnStore = false;
            this.snackbar = true;
            this.textSnackbar = "Store Added Succesfully  "
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    async fetchStore() {
      //Fetch the store and add the values into the arrays in order to show them  on the table and the product v-select
      this.loading = true;
      this.storeItems = [];
      this.itemsStore = [];
      let config = {
        method: 'get',
        url: 'http://localhost:8081/api/stores',
      };

      axios.request(config)
        .then((response) => {
          for (const element of response.data.data) {
            this.storeItems.push({ "name": element.name + "-" + element.category, "value": element.id });
            this.itemsStore.push({ "storename": element.name, "categorys": element.category });
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    alphanumeric() {
      //this function is to generate the alphanumeric code for the name
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      for (let i = 0; i < 5; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
      }
      return code;
    },
    generateSKU() {
      //this function is to generate the SKU number for the name
      const prefix = '000';
      const productIDLength = 4;
      const maxProductID = Math.pow(10, productIDLength) - 1;
      let productID = Math.floor(Math.random() * maxProductID) + 1;
      return prefix + productID.toString().padStart(productIDLength, '0');
    },
    async saveProduct() {
      //When we save the product, we concatenate the alphanumeric code plus the name and the SKU
      if (this.$refs.formProduct.validate()) {
        this.loadingBtnProduct = true;
        let newCode = this.alphanumeric();
        let SKU = this.generateSKU();
        let data = {
          store_id: this.storeID.toString(),
          name: newCode + ' - ' + this.productName + ' - ' + SKU,
          description: this.Description,
          price: Number(this.price)
        };

        let config = {
          method: 'post',
          url: 'http://localhost:8081/api/products',
          data: data
        };
        axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            this.loadingBtnProduct= false;
            this.fetchProducts();
          })
          .catch((error) => {
            console.log(error);
            this.loadingBtnProduct= false;
          });
      }
    },

    async fetchProducts() {
      let config = {
        method: 'get',
        url: 'http://localhost:8081/api/products',
        // headers: {
        //   'Authtoken': '412da268fa8e2241ecd77e1c7fd15a',
        // },
      };

      axios.request(config)
        .then((response) => {
          console.log(response)
          //in here we need tu put the code to show the products into the table
          for (const element of response.data.data) {
            this.items.push({ "ProductName": element.name, "Description": element.description , "price": element.price , "store": element.store.name });
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}
</script>