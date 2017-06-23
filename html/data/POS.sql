Select Zone.name As Zone, Quartier.name As Quartier, Ilot.name As Ilot 
From Elements Zone Inner Join Relations 
    On Zone.id = Relations.mytarget 
    	Inner Join Elements Quartier 
    		On Relations.mysource = Quartier.id 
    			Inner Join Relations Relations1 
    				On Quartier.id = Relations1.mytarget 
    					Inner Join Elements Ilot 
    						On Relations1.mysource = Ilot.id 
Where Zone.type = 'ApplicationCollaboration' And Quartier.type = 'ApplicationCollaboration' And  Ilot.type = 'ApplicationCollaboration'
