package org.project.ecom.service;


import lombok.RequiredArgsConstructor;
import org.project.ecom.model.Attribute;
import org.project.ecom.repository.AttributeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttributeService {

      private final AttributeRepository attributeRepository;

        // get all attributes
        public List<Attribute> getAllAttributes() {
            return (List<Attribute>) attributeRepository.findAll();
        }

        // get attribute by id
        public Attribute getAttributeById(Long id){
            return attributeRepository.findById(id).orElseThrow(() -> new RuntimeException("Attribute not found"));
        }

        // create attribute
        public void createAttribute(Attribute model){
            attributeRepository.save(model);
        }

        // update attribute
        public void updateAttribute(Attribute model){
            Attribute attributeModel = attributeRepository.findById(model.getAttributeId()).orElseThrow(() -> new RuntimeException("Attribute not found"));
            if(attributeModel.getAttributeId()!=null){
                attributeRepository.save(model);
            }
        }

        // delete attribute
        public void deleteAttribute(Attribute model){
            Attribute attributeModel = attributeRepository.findById(model.getAttributeId()).orElseThrow(() -> new RuntimeException("Attribute not found"));
            if(attributeModel.getAttributeId()!=null){
                attributeRepository.deleteById(model.getAttributeId());
            }
        }

    }
