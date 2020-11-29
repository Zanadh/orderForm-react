import React, { useEffect, useState } from 'react'
import './App.css';
import { PlusOutlined, MinusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Row, Col, Form, Input, Divider, Select, DatePicker, InputNumber, Modal } from 'antd';
import Axios from 'axios'

const { Option } = Select

let dataStatic = [
  { "id": 1, "employee_name": "Tiger Nixon", "employee_salary": 320800, "employee_age": 61, "profile_image": "" },
  { "id": 2, "employee_name": "Garrett Winters", "employee_salary": 170750, "employee_age": 63, "profile_image": "" },
  { "id": 3, "employee_name": "Ashton Cox", "employee_salary": 86000, "employee_age": 66, "profile_image": "" },
  { "id": 4, "employee_name": "Cedric Kelly", "employee_salary": 433060, "employee_age": 22, "profile_image": "" },
  { "id": 5, "employee_name": "Airi Satou", "employee_salary": 162700, "employee_age": 33, "profile_image": "" }
]
let dcStatic = [
  { "id": 1, "name": "DC Tangerang" },
  { "id": 2, "name": "DC Jakarta" },
  { "id": 3, "name": "DC Bandung" },
]

let paymentTypeStatic = [
  { "id": 1, "name": "Cash H+1" },
  { "id": 2, "name": "Cash H+3" },
  { "id": 3, "name": "Cash H+7" },
  { "id": 4, "name": "Transfer H+1" },
  { "id": 5, "name": "Transfer H+3" },
  { "id": 6, "name": "Transfer H+7" },
]

let productStatic = [
  {
    product_name: 'product_1', units: [
      { name: 'Karton', price: 35000 },
      { name: 'Pak', price: 10000 },
      { name: 'Pcs', price: 1000 }
    ]
  },
  {
    product_name: 'product_2', units: [
      { name: 'Karton', price: 45000 },
      { name: 'Pak', price: 7000 },
      { name: 'Pcs', price: 500 }
    ]
  },
  {
    product_name: 'product_3', units: [
      { name: 'Pak', price: 15000 },
      { name: 'Pcs', price: 1500 }
    ]
  },
]


function App() {
  const [employeeData, setEmployeeData] = useState([])
  const [detailInput, setDetailInput] = useState({
    name: null,
    distribution_center: null,
    payment_type: null,
    expired_date: null,
    notes: null
  })
  const [productInput, setProductInput] = useState([
    {
      product_name: null,
      unit: '',
      quantity: '',
      price: 0,
      total_price: 0,
    },
  ])
  const [totalPrice, setTotalPrice] = useState(0)
  const [formStatus, setFormStatus] = useState(false) 

  function showPromiseConfirm() {
    Modal.confirm({
      title: 'Do you want to make the order?',
      icon: <ExclamationCircleOutlined />,
      content: 'Your order will be saved to the database',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(1 > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }



  const addProductField = () => {
    let newField = productInput.concat({
      product_name: null,
      unit: null,
      quantity: '',
      price: 0,
      total_price: 0,
    })
    setProductInput(newField)
  }
  const deleteProductField = (index) => {
    console.log(index);
    let newField = [...productInput]
    newField.splice(index, 1)
    console.log(newField);
    setProductInput(newField)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get('http://dummy.restapiexample.com/api/v1/employees')
        const { data } = await response
        setEmployeeData(data.data);
        console.log(data);
      } catch (e) {
        // console.error(e);
        console.log("using static data");
        setEmployeeData(dataStatic); // handling response status 429
      }
    }; 
    fetchData();
  }, []);

  const handleChange = (name, value) => {
    console.log(value);
    setDetailInput({ ...detailInput, [name]: "" + value })
  } 
  
  const handleChangeProduct = (index, name, value) => {
    // const { value, name } = event.target 
    let productName = productInput[index].product_name
    let product = productStatic.find(product => product.product_name === productName)

    console.log(value, name, index);
    let newData = [...productInput]
    if (name === 'unit') {
      let { units } = product
      let { price } = units.find(unit => unit.name === value)
      newData[index].price = price
    }
    if (name === 'quantity' && !value) {
      value = 0
    }
    newData[index][name] = value
    setProductInput(newData) 
    if (productInput[index].price && (productInput[index].quantity || productInput[index].quantity === 0)) {
      newData[index].total_price = productInput[index].price * productInput[index].quantity
      setProductInput(newData)
    }
    if(name === 'product_name') {
      newData[index] = { 
        product_name:value,
        unit: '',
        quantity: '',
        price: 0,
        total_price: 0,
      }
      console.log("reset form");
      setProductInput(newData)
    }
  }

  useEffect(() => { //validasi
    let detailStatus = false
    let productStatus = true
    console.log(detailInput);
    console.log(productInput);
    let {distribution_center,name,payment_type,expired_date} = detailInput
    if(distribution_center && distribution_center !== '' && name && name !== '' && payment_type && payment_type !== '' && expired_date && expired_date !== ''){
      detailStatus = true
    }
 
    for (let i = 0; i < productInput.length; i++) {
      Object.keys(productInput[i]).find(key=>{
        if(!productInput[i][key] || productInput[i][key] === ''){
          console.log("FOUND FALSY");
          productStatus = false 
        } 
        return ''
      })
    }

    if(detailStatus && productStatus){
      setFormStatus(true)
    }else {
      setFormStatus(false)
    }

  }, [detailInput, productInput])

  const finish = () => {
    // showModal()
    showPromiseConfirm()
    console.log(detailInput);
    console.log(productInput);
  }
  useEffect(() => {
    let totalPrice = 0
    console.log("product length : ", productInput.length);
    productInput.forEach(el=>{
      totalPrice += el.price*el.quantity
    })
    setTotalPrice(totalPrice)
    
  }, [productInput])

  const createSelectItem = (index) => {
    let productName = productInput[index].product_name
    let productData = productStatic.find(product => product.product_name === productName) 
    let inputtedProduct = productInput.filter(el => el.product_name === productName)
    let items = [];
    if (productData) {
      let { units } = productData

      for (let i = 0; i < units.length; i++) {
        let found = false
        for (let y = 0; y < inputtedProduct.length; y++) {
          if (inputtedProduct[y].unit === units[i].name) {
            found = true
          }
        }
        if (!found) { 
          items.push(<Option key={i} value={units[i].name}>{units[i].name}</Option>); 
        }
      }
    }
    return items;
  }
  return (
    <div className="App">  
      <div className="container">
        <h3>Create Order</h3>
        <div className="form-container" >
          <Form
            layout="vertical"
            onFinish={finish}
            requiredMark={false}
          >
            <div >
              <Row>
                <Col sm={24} lg={8} style={{ fontWeight: 'bold', borderWidth: 1, borderColor: 'black' }}>
                  Detail
              </Col>
                <Col sm={24} xl={14} >
                  <Row>
                    <Col span={18} style={{ borderWidth: 1, borderColor: 'black' }}>
                      <Form.Item 
                        label={<><p className="label">Name </p><p className="required">*</p></>}
                        name="name"
                        rules={[{ required: true, message: 'Please Input Detail Name!' }]}
                      >
                        <Select placeholder="Please select a country" onChange={(value) => handleChange("name", value)}>
                          {
                            employeeData.map(value => {
                              return <Option key={value.id} value={value.employee_name}>{value.employee_name}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{ borderWidth: 1, borderColor: 'black' }}>
                      <Form.Item  
                        label={<><p className="label">Distribution Center </p><p className="required">*</p></>}
                        name="distribution_center"
                        rules={[{ required: true, message: 'Please select distribution center!' }]}
                      >
                        <Select placeholder="Please select a distribution center" onChange={(value) => handleChange("distribution_center", value)}>
                          {detailInput.name === '' || !detailInput.name ? <Option disabled value="">No Data Available</Option> :
                            dcStatic.map(value => {
                              return <Option key={value.id} value={value.name}>{value.name}</Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  {!detailInput.distribution_center || detailInput.distribution_center === '' ? null :
                    <>
                      <Row gutter={10}>
                        <Col span={12}>
                          <Form.Item 
                            label={<><p className="label">Payment Type </p><p className="required">*</p></>}
                            name="payment_type"
                            rules={[{ required: true, message: 'Payment type is required!' }]}
                          >
                            <Select placeholder="Select Payment Type" onChange={(value) => handleChange("payment_type", value)}>
                              {
                                paymentTypeStatic.map(value => {
                                  return <Option key={value.id} value={value.name}>{value.name}</Option>
                                })
                              }
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item 
                            label={<><p className="label">Expired Date </p><p className="required">*</p></>}
                            name="expired_date"
                            rules={[{ required: true, message: 'Expired date is required!' }]}
                          >
                            <DatePicker onChange={(date, dateString) => handleChange("expired_date", dateString)} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={18} style={{ borderWidth: 1, borderColor: 'black' }}>
                          <Form.Item label="Notes">
                            <Input.TextArea placeholder="input placeholder" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  }
                  {/* </Form> */}
                </Col>
              </Row>
            </div>
            {!detailInput.distribution_center || detailInput.distribution_center === '' ? null :
              <>
                {/* <div style={{ padding: 10 }}>
                  <Divider />
                  <Row>
                    <Col sm={24} lg={8} style={{ fontWeight: 'bold', borderWidth: 1, borderWidth: 1, borderColor: 'black' }}>
                      Products
                      </Col>
                    <Col xl={14} >
                      <div>
                        <Row gutter={10}>
                          <Col span={18} style={{ borderWidth: 1, borderColor: 'black' }}>
                            <Form.Item label="Product"> 
                              <Select placeholder="Select Product" onChange={(value) => handleChangeProduct(0, "product_name", value)}>
                                {
                                  productStatic.map(value => {
                                    return <Option key={value.id} value={value.product_name}>{value.product_name}</Option>
                                  })
                                }
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={6} style={{ borderWidth: 1, borderColor: 'black' }}>
                            <Form.Item label="Unit">
                              <Select placeholder="Select Unit Type" onChange={(value) => handleChangeProduct(0, "unit", value)}>
                                {productInput[0].name === '' ?
                                  <Option disabled>No Data Available</Option> :
                                  createSelectItem(0)
                                }
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={[24, 8]}>
                          <Col span={6} style={{ borderWidth: 1, borderColor: 'black' }}>
                            <Form.Item style={{ marginBottom: 0 }} label="Quantity">
                              <InputNumber value={productInput[0].quantity} min={0} placesholder="input quantity" value={productInput[0].quantity} onChange={(value) => handleChangeProduct(0, 'quantity', value)} />
                            </Form.Item>
                          </Col>
                          <Col span={6} style={{ borderWidth: 1, borderColor: 'black' }}>
                            <Form.Item style={{ marginBottom: 0 }} label="Price">
                              <InputNumber placeholder="input quantity" name="price" value={productInput[0].price} />
                            </Form.Item>
                          </Col>
                          <Col span={12} style={{ borderWidth: 1, borderColor: 'black' }}>
                            <Form.Item style={{ marginBottom: 0 }} label="Total Price">
                              <Input value={productInput[0].total_price} placeholder="input placeholder" disabled />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col offset={12} span={12}>
                            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                            <p style={{ float: 'left', fontWeight: 'bold' }}>
                              Total Nett Price :
                              </p>
                            <p style={{ float: 'right', fontWeight: 'bold' }}>
                              {productInput[0].total_price}
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div> */}
                {!productInput ? null :
                  productInput.map((input, i) => (
                    // i === 0 ? null :
                    <div key={i} style={{ padding: 10 }}>
                      <Row>
                        {
                          i === 0 ?
                            <Col sm={24} lg={8} style={{ fontWeight: 'bold'}}>
                              Products
                          </Col> : null
                        }
                        <Col sm={24} xl={i === 0 ? { span: 14, } : { span: 14, offset: 8 }} >
                          <Row gutter={10}>
                            <Col span={18} style={{ borderWidth: 1, borderColor: 'black' }}>
                              <Form.Item
                                label={<><p className="label">Product </p><p className="required">*</p></>} 
                                // name={`product_name_${i}`}
                                rules={[{ required: true, message: 'Please input product name!' }]}
                              
                              >
                                <Select placeholder="Select Product" value={productInput[i].product_name} onChange={(value) => handleChangeProduct(i, "product_name", value)}>
                                  {
                                    productStatic.map(value => {
                                      return <Option key={value.id} value={value.product_name}>{value.product_name}</Option>
                                    })
                                  }
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={6} style={{ borderWidth: 1, borderColor: 'black' }}>
                              <Form.Item  
                                // name={`unit_type_${i}`}
                                rules={[{ required: true, message: 'Please input unit type!' }]} 
                                label={<><p className="label">Unit </p><p className="required">*</p></>} 
                                >
                                <Select placeholder="Select Unit Type" value={productInput[i].unit} onChange={(value) => handleChangeProduct(i, "unit", value)}>
                                  {productInput[i].name === '' ?
                                  <Option disabled value="">No Data Available</Option> 
                                  :
                                    createSelectItem(i)
                                  }
                                </Select>
                              </Form.Item> 
                            </Col>
                          </Row>
                          <Row gutter={10}>
                            <Col span={6} style={{ borderWidth: 1, borderColor: 'black' }}>
                              <Form.Item
                                // name="quantity"
                                // name={`quantity1`}
                                rules={[{ required: true, message: 'Please input product price!' }]}
                                style={{ marginBottom: 0 }} 
                                label={<><p className="label">Quantity </p><p className="required">*</p></>}  
                                >
                                <InputNumber style={{width: '100%'}} value={productInput[i].quantity} min={0} placesholder="input quantity" onChange={(value) => handleChangeProduct(i, 'quantity', value)} />
                              </Form.Item>
                            </Col>
                            <Col span={6} style={{ borderWidth: 1, borderColor: 'black' }}>
                              <Form.Item 
                                // name="price"
                                // rules={[{ required: true, message: 'Please input product price!' }]}
                                style={{ marginBottom: 0 }} 
                                label={<><p className="label">Unit </p><p className="required">*</p></>}  
                                > 
                                <InputNumber style={{width: '100%'}} placeholder="input quantity" name="price" value={productInput[i].price} />
                              </Form.Item>
                            </Col>
                            <Col span={12} style={{ borderWidth: 1, borderColor: 'black' }}>
                              <Form.Item 
                                // name="total_price"
                                rules={[{ required: true, message: '' }]}
                                className="totalPriceContainer" 
                                label={<><p style={{marginTop:0, marginBottom:0,width:'100%'}}>Total Price</p><p className="required">*</p></>}>
                                <Input name="" value={productInput[i].total_price} style={{ textAlign: 'right' }} placeholder="input placeholder" disabled />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={12}>
                              {
                                i === 0 ? null :
                                  <Button
                                    style={{ paddingRight: 0, marginTop:10 }}
                                    onClick={() => deleteProductField(i)}
                                    danger
                                    type="primary">Delete Field <MinusOutlined /> </Button>
                              }
                            </Col>
                            <Col span={12}>
                              <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                              <p style={{ float: 'left', fontWeight: 'bold' }}>
                                Total Nett Price :
                                  </p>
                              <p style={{ float: 'right', fontWeight: 'bold' }}>
                                {productInput[i].total_price}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  ))}
                <Row>
                  <Col offset={8}>
                    <Form.Item>
                      <Button
                        style={{ paddingRight: 0, background: "#f5bb0c", borderColor: "#c7980a"  }}
                        onClick={addProductField} 
                        type="primary"
                        >New item <PlusOutlined /> </Button>
                    </Form.Item>
                  </Col>
                </Row>
                <Row> 
                  <Col offset={12} span={10}>
                    <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                    <p style={{ float: 'left', fontWeight: 'bold', fontSize:18 }}>
                      Total :
                    </p>
                    <p style={{ float: 'right', fontWeight: 'bold' }}>
                      {totalPrice}
                    </p>
                  </Col>
                </Row>
              </>
            }
            <Divider />
            <div style={{ textAlign: 'right', padding: 10, paddingRight: 20 }}>
              <Button type="text">Cancel</Button>
              <Button 
                style={formStatus?{background: "#03a10d", borderColor: "#03a10d"}:{background: "#d4d4d4", borderColor: "#ababab"}}
                type="primary" 
                disabled={!formStatus}
                htmlType="submit">Submit</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default App;
